## ⚠️ Dynamic Route Folder Rename Required

After cloning, you must rename one folder due to a shell limitation during scaffolding:

```bash
# From inside frontend/app/builder/
mv id '[id]'
```

This is required because Next.js App Router uses `[id]` as the folder name for dynamic routes,
but the `[` and `]` characters cannot be used in shell `mkdir` commands without escaping.

After renaming, your folder structure should be:
```
frontend/app/builder/[id]/page.tsx
```

This is already noted in the README quick-start section.
