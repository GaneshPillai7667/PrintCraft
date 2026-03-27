FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_DEFAULT_TENANT_ID=11111111-1111-1111-1111-111111111111
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_DEFAULT_TENANT_ID=$VITE_DEFAULT_TENANT_ID

COPY PrintCraftClientPortal/package*.json ./
RUN npm ci

COPY PrintCraftClientPortal/ ./
RUN npm run build

FROM nginx:1.27-alpine AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
