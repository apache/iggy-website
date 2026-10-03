# Introduction

> The AI-related components of Apache Iggy: the MCP server that lets LLM applications work with a running Iggy server.

Rendered page: https://iggy.apache.org/docs/ai/introduction/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/ai/introduction.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

Apache Iggy includes an MCP server, so LLM applications can work with a running Iggy server. The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is an open protocol that standardizes how applications provide context to LLMs.

Through the MCP server, an MCP client can check server health and statistics, create and manage streams, topics and partitions, send and poll messages, manage consumer groups and offsets, and administer users and personal access tokens. It connects to Iggy over TCP with its own credentials, and supports **HTTP** (the default) and **stdio** transports, with stdio suited to clients running on the same machine.

Access is limited in two layers. The `[permissions]` section of the MCP server's configuration can restrict it to read-only operations, and the Iggy user it connects as keeps its own permissions on the server. For production use, connect as a dedicated user with the minimum permissions it needs.

See **[MCP Server](https://iggy.apache.org/docs/ai/mcp)** for how to run and configure it, the full list of tools, and client setup.
