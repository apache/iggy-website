---
title: Personal access tokens
slug: personal-access-tokens
authors: [piotr]
tags: [new-features, personal-access-tokens, pat]
hide_table_of_contents: false
---

Since the most recent update, Iggy.rs supports personal access tokens, which can be used to authenticate the clients, instead of the username and password. The tokens can be created and deleted using the available APIs.

<!--truncate-->

## Breaking changes

No breaking changes have been introduced in neither Iggy server, nor Iggy SDK. The server does support the new `PAT` authentication method since version `0.0.40`, and the SDK since version `0.0.100`. The initial changes are part of the commit [#e74c25e](https://github.com/apache/iggy/commit/e74c25e058b1f39119ee89b5ada5d93f171cb221).

## Personal access tokens

PAT is a simple idea, which allows authenticating the clients using a token, instead of the regular credentials (username and password). This approach might feel safer for some users, as the token can be deleted at any time, and it's not tied to the user's password. The tokens can be created, listed and deleted using the available APIs. PAT has an optional expiry, which can be set when creating the token.


```rust
pub struct CreatePersonalAccessToken {
    pub name: String,
    pub expiry: Option<u32>,
}

pub struct DeletePersonalAccessToken {
    pub name: String,
}

pub struct GetPersonalAccessTokens {}

pub struct LoginWithPersonalAccessToken {
    pub token: String,
}
```

Each token must have a unique `name`, which is used to identify the token. The `expiry` field is optional, and if set, it must be the amount of seconds since the token creation on the server side, after which the token will expire. A single user may create the maximum of 100 tokens.

```rust
async fn get_personal_access_tokens(
    &self,
    command: &GetPersonalAccessTokens,
) -> Result<Vec<PersonalAccessTokenInfo>, Error>;

async fn create_personal_access_token(
    &self,
    command: &CreatePersonalAccessToken,
) -> Result<RawPersonalAccessToken, Error>;

async fn delete_personal_access_token(
    &self,
    command: &DeletePersonalAccessToken,
) -> Result<(), Error>;

async fn login_with_personal_access_token(
    &self,
    command: &LoginWithPersonalAccessToken,
) -> Result<IdentityInfo, Error>;
```

When creating the token, the server returns the `RawPersonalAccessToken` struct, which contains the string `token` value.

```rust
pub struct RawPersonalAccessToken {
    pub token: String,
}
```

This is returned **only once**, as it's a raw, secure token, which should be stored by the client. The server only stores the hashed version of the token, and it's not possible to retrieve the original value. The token can be used to authenticate the client using the `LoginWithPersonalAccessToken` command.

The following structure is returned when listing the tokens. It contains the `name` and an optional `expiry` fields. Please note that the `expiry` is the actual timestamp (Epoch in microseconds) of when the token will expire, and not the amount of seconds since the token creation (like provided in the `CreatePersonalAccessToken` command).

```rust
pub struct PersonalAccessTokenInfo {
    pub name: String,
    pub expiry: Option<u64>,
}
```

Login with PAT is very similar to the regular login with user credentials, and it returns the same `IdentityInfo` structure.

## Configuration

On the server side, you can enable the background task responsible for deleting the expired tokens.

```toml
[personal_access_token_cleaner]
enabled = true
interval = 60
```
