# Firebase Configuration

Place your Firebase service account JSON credentials here as `serviceAccountKey.json`.

Enable Firestore in your Firebase project. Then either set the environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/firebase_config/serviceAccountKey.json"
export FIREBASE_ENABLED=true
```

Or keep the file at `firebase_config/serviceAccountKey.json` in the project root and set `FIREBASE_ENABLED=true`.

Optional: Set `ADMIN_TOKEN` to protect the logs endpoint.