```sh
docker build -t webrtc-based-video-call .
docker run -p 4000:4000 --env-file ./backend/.env webrtc-based-video-call
```
