## REST API

- POST /api/auth/register - {username, email, password}
- POST /api/auth/login - {email, password} {token , user}
- GET /api/rooms - قائمة الغرف
- POST /api/rooms (Auth) - {name, descriptaion? , isPrivate}


## Pusher

- POST /api/pusher/auth (Auth) - {socket_id, channel_name}
- POST /api/rooms/:id/messages (Auth) - {text}
- Room updates are published on `private-room-{roomId}` as `new-message`
