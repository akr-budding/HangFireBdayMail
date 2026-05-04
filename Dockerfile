# ── Stage 1: Build Angular ────────────────────────────────────────────────────
FROM node:20-alpine AS angular-build
WORKDIR /app

COPY hangfire-birthday-ui/package*.json ./
RUN npm install --silent

COPY hangfire-birthday-ui/ ./
RUN npm run build -- --configuration production

# ── Stage 2: Build .NET API ───────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-build
WORKDIR /src

# Restore packages first (layer cache)
COPY HangFire_Birthday/HangFire_Birthday.csproj ./HangFire_Birthday/
RUN dotnet restore ./HangFire_Birthday/HangFire_Birthday.csproj

# Copy source
COPY HangFire_Birthday/ ./HangFire_Birthday/

# Copy Angular production build into wwwroot
COPY --from=angular-build /app/dist/hangfire-birthday-ui/browser/ ./HangFire_Birthday/wwwroot/

# Publish
WORKDIR /src/HangFire_Birthday
RUN dotnet publish HangFire_Birthday.csproj -c Release -o /app/publish /p:UseAppHost=false

# ── Stage 3: Runtime image ────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=dotnet-build /app/publish .

# Render injects PORT at runtime — app reads it in Program.cs
EXPOSE 5000

ENTRYPOINT ["dotnet", "HangFire_Birthday.dll"]
