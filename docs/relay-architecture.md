# Relay Technical Specification

You own the architecture and implementation. Make decisions where requirements are ambiguous. Prefer shipping over theoretical perfection.

## 1. Product scope

Relay Core is the product. It is not just a widget. It is a lightweight Intercom-style platform composed of:

- Dashboard
- Widget SDK
- AI Engine
- Visitor Intelligence
- Knowledge Base
- Realtime Messaging

The implementation must optimize for one developer maintaining the system, low infrastructure cost, and fast iteration.

## 2. Mandatory requirements

### 2.1 Installation and onboarding
Every project must support an installation wizard that produces:

- React install snippet
- Script install snippet
- Widget public key
- Domain whitelist
- Installation verification status

The wizard must validate the domain, generate the widget key, and confirm the embed works before the project is marked live.

### 2.2 Conversation states and priority
Conversation state is mandatory:

- OPEN
- PENDING
- RESOLVED
- CLOSED
- SPAM

Conversation priority is mandatory:

- LOW
- MEDIUM
- HIGH
- URGENT

These fields must be available in the inbox, filters, and realtime updates.

### 2.3 Internal notes
Every conversation must support internal notes:

- Private to operators only
- Never shown to visitors
- Stored with the conversation record
- Editable by assigned operators

### 2.4 Confidence policy for AI
Every AI response must return:

{
  confidence: number,
  reasoning: string,
  shouldEscalate: boolean
}

Escalation is deterministic:

- If confidence < 0.65, set `shouldEscalate = true`
- If the conversation is in HUMAN mode, never allow AI to reply
- If the project is offline or AFK, fallback to a canned human-available message
- If the AI gateway fails, send a safe fallback response and mark the conversation for human review

### 2.5 Versioned widget settings
Project settings must be versioned:

- draft
- published

Active chats must never switch behavior mid-session because a setting changed in the editor. The widget must consume the published version until the project explicitly republishes.

### 2.6 Project environments
Every project must support multiple environments:

- Production
- Staging
- Development

Each environment must have its own:

- environment
- widget_key
- allowed_domains

This prevents testing widgets on live production sites.

## 3. System architecture

### 3.1 Runtime split
- Dashboard: Next.js App Router admin surface for inbox, projects, settings, visitors, and knowledge base
- Widget SDK: lightweight client API for embedding and runtime interaction
- AI Engine: Gemini 2.5 Flash through InsForge AI Gateway with retrieval and confidence decisions
- Realtime: InsForge realtime channels for inbox, typing, assignment, visitor, and AI status updates
- Storage: InsForge storage for KB uploads and widget assets

### 3.2 Core implementation rule
Use InsForge as the single backend service for DB, auth, storage, realtime, vector search, AI, and edge functions. Keep the dashboard and widget runtime thin and composable.

## 4. Folder structure

```text
app/
  (dashboard)/
    projects/
    inbox/
    visitors/
    knowledge-base/
    settings/
    install/
  widget/
    page.tsx
    embed.ts
    sdk.ts
  api/
    widget/
    ai/
    kb/
    realtime/
components/
  dashboard/
  widget/
  ui/
lib/
  relay/
    config.ts
    security.ts
    ai.ts
    kb.ts
    realtime.ts
    telemetry.ts
    versioning.ts
lib/
  server/
    ai-response.ts
    human-handoff.ts
    ingest-kb.ts
    visitor-track.ts
    widget-auth.ts
schema/
  sql/
    001_projects.sql
    002_visitors.sql
    003_conversations.sql
    004_messages.sql
    005_kb.sql
    006_notes.sql
    007_audit.sql
```

## 5. Database and data model

### Projects
- id
- name
- domain
- environment
- widget_key
- allowed_domains
- theme_config
- ai_config
- chat_config
- settings_version
- status
- created_at
- updated_at

### Visitors
- id
- project_id
- session_id
- visitor_key
- fingerprint
- anonymous_name
- user_agent
- device_type
- browser
- country
- city
- entry_page
- current_page
- referrer
- first_seen_at
- last_seen_at
- is_bot
- consent_status

### Conversations
- id
- project_id
- visitor_id
- assignment_id
- mode (AI | HUMAN | HYBRID)
- status (OPEN | PENDING | RESOLVED | CLOSED | SPAM)
- priority (LOW | MEDIUM | HIGH | URGENT)
- unread_count
- last_message_at
- created_at
- updated_at

### Messages
- id
- conversation_id
- author_type (VISITOR | AI | HUMAN)
- author_id
- body
- metadata
- attachments
- attachment_count
- created_at

### Internal notes
- id
- conversation_id
- author_id
- body
- visibility (PRIVATE)
- created_at
- updated_at

### Saved replies
- id
- project_id
- title
- body
- shortcut
- created_at
- updated_at

### Knowledge base documents
- id
- project_id
- source_type (PDF | DOCX | MD | TXT)
- storage_key
- title
- status (QUEUED | PARSED | INDEXED | FAILED)
- chunk_count
- updated_at

### Knowledge base chunks
- id
- document_id
- embedding
- content
- token_count
- section_hint

### Audit events
- id
- project_id
- event_type
- actor_type
- actor_id
- payload
- created_at

## 6. Realtime channel design

Use InsForge realtime channels with the following contract:

- `conversation:{id}` for message updates, typing, and takeover events
- `project:{id}:inbox` for inbox list changes, assignment, status, and priority updates
- `project:{id}:visitors` for visitor activity, page changes, and session state
- `project:{id}:ai` for AI decision events and fallback status

All realtime events must be deduplicated client-side and must not rely on polling for core inbox behavior.

## 7. Widget SDK API

The widget is a product surface and must expose the following API:

```ts
LiveChat.init(config)
LiveChat.open()
LiveChat.close()
LiveChat.show()
LiveChat.hide()
LiveChat.toggle()
LiveChat.identify({ id, name, email })
LiveChat.track(eventName, payload?)
LiveChat.shutdown()
```

Example:

```ts
LiveChat.identify({
  id: user.id,
  name: user.name,
  email: user.email,
});

LiveChat.track("course_purchased");
```

The SDK must support persisted minimized state, unread counts, typing indicators, reconnect behavior, AI responses, human takeover, theme switching, and explicit show/hide behavior for checkout and embedded flows.

## 8. AI pipeline

The AI pipeline must use Gemini 2.5 Flash through InsForge AI Gateway with this exact flow:

1. Receive visitor message
2. Load project config and published settings version
3. Retrieve top-k knowledge base chunks using vector search
4. Build the prompt from system prompt, conversation history, KB context, and project rules
5. Call the AI model
6. Require a structured response with `confidence`, `reasoning`, and `shouldEscalate`
7. If `shouldEscalate = true`, stop the AI response and route to human mode
8. If AI fails, send the fallback message and create an audit event

This is not optional. Confidence must be explicit and deterministic.

## 9. Knowledge-base ingestion flow

1. Upload PDF, DOCX, Markdown, or TXT
2. Parse and normalize content
3. Chunk content into sections
4. Embed chunks with InsForge vector search
5. Store metadata and source links
6. Re-index on document update
7. Use top-k retrieval for every AI answer

The knowledge base must support stale-content refresh and document status tracking.

## 10. Dashboard page map

- /projects
- /projects/[id]
- /projects/[id]/install
- /inbox
- /inbox/[conversationId]
- /visitors
- /knowledge-base
- /settings
- /settings/ai
- /settings/widget

## 11. State management strategy

Use server state for project, conversation, visitor, KB, and settings data. Use local UI state only for transient interactions such as composer draft, panel open/closed, and hover state. Persist only session-safe widget state in browser storage.

## 12. Security model

The implementation must enforce:

- widget authentication and public key validation
- rate limiting and abuse prevention
- input sanitization and XSS protection
- project domain whitelisting
- operator-level authorization for notes, assignments, and settings
- audit logging for AI decisions and human handoff events
- event model validation for `page_view`, `signup`, `purchase`, `form_submit`, and `checkout_started`

## 13. Visitor event model

The widget must emit structured events for:

- `page_view`
- `signup`
- `purchase`
- `form_submit`
- `checkout_started`

These events must be stored in analytics tables and used for reporting, AI context, and follow-up automation.

## 14. Analytics model

The dashboard must expose:

- Conversations Started
- Conversations Resolved
- Human Takeovers
- AI Resolution Rate
- Average Response Time
- Average Conversation Length
- Top Questions
- Top KB Articles

These metrics must be derived from conversations, messages, and visitor events.

## 15. Operator presence model

Operator presence must support:

- ONLINE
- BUSY
- AFK
- OFFLINE

AI behavior must respect these states:

- ONLINE → escalate to human when confidence is low
- BUSY → allow AI to handle longer or more complex tasks
- AFK → use contact-form or fallback messaging
- OFFLINE → capture contact details and queue for later follow-up

## 16. Implementation approach

Before implementing each phase:

1. Explain what will be built.
2. Explain why.
3. Identify risks.
4. Then implement.

Do not stop at planning documents.