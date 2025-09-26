<!-- webrtc-based-video-call -->

## Constitution

Create principles focused on code quality, user experience consistency, security and performance requirements. Using nextjs app router and typescript.

## Commands

```sh
docker build -t webrtc-based-video-call .

docker run -p 4000:4000 --env-file ./backend/.env webrtc-based-video-call

curl http://localhost:4000/api/health

brew install aws/tap/copilot-cli

aws configure

copilot init
# Application name: webrtc-app
# Workload type: Load Balanced Web Service
# Service name: app
# Dockerfile: ./Dockerfile
# Port: 4000
# Deploy: Yes

aws acm list-certificates --region ap-southeast-1

aws acm request-certificate \
  --domain-name aws.quochuy.dev \
  --validation-method DNS \
  --region ap-southeast-1

copilot env init --name dev --import-cert-arns arn:aws:acm:ap-southeast-1:617706767408:certificate/f7009aac-1d90-4c82-8a98-fe20d02a0d16

copilot env upgrade --name dev

copilot svc show --name app

# aws.quochuy.dev CNAME
copilot svc deploy --name app --env dev

sudo dscacheutil -flushcache

sudo killall -HUP mDNSResponder

curl -vk https://aws.quochuy.dev/api/health

# DELETE
copilot svc delete --name app --env dev

copilot env delete --name dev

copilot app delete

```

```yaml
# overlay
http:
  path: "/"
  alias: aws.quochuy.dev

environments:
  dev:
    image:
      build:
        args:
          VITE_API_BASE: "https://aws.quochuy.dev"
          VITE_WS_BASE: "wss://aws.quochuy.dev"
    variables:
      NODE_ENV: production
      BASE_URL: "https://aws.quochuy.dev"
      APP_URL: "https://aws.quochuy.dev"

# environment
http:
  public:
    certificates: [arn:aws:acm:ap-southeast-1:123456789012:certificate/12345678-1234-1234-1234-123456789012]
```
