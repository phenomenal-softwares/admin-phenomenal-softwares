# Phenomenal Softwares Admin

React and Vite admin workspace for the Phenomenal Softwares catalogue. The app signs in one allowlisted admin, listens to the `products` collection in the `phenomenal-softwares` Firestore database, and stores product assets in Firebase Storage.

## Environment configuration

Copy `.env.example` to `.env` and supply Firebase project credentials. Set `ADMIN_EMAIL` to the one email allowed into the console; it must match the email in Firebase Authentication.

Vite exposes the allowlist value in the client bundle, so it is not a secret or a substitute for database rules. The Firestore and Storage rule files enforce the same allowlisted email on data access. Set the Firebase CLI project to the same project as `FIREBASE_PROJECT_ID` in `.env`, then deploy the configured rules:

```sh
firebase deploy --only firestore,storage --project YOUR_FIREBASE_PROJECT_ID
```

Firestore rules are configured for the `phenomenal-softwares` database; Storage rules are configured for the project's default bucket. A successful Firebase Auth sign-in does not grant Firestore access until these rules are deployed to the matching project/database.

## Product document shape

Product documents use Firestore-generated document IDs, also stored in the `id` field:

```js
{
  id,
  name,
  type,
  description,
  url,
  imagePrimary, // Firebase Storage object path
  imagePhone,   // Firebase Storage object path
  gallery,      // array of Firebase Storage object paths
  readMe,       // Firebase Storage object path
  developerInfo: {
    description,
    mode,
    targetPlatforms, // array of strings
    languages,
    framework,
    styling,
    animation,
    icons,
    hosting,
    status,
    initialRelease,
  },
}
```

All assets are stored below `phenomenal-softwares/products/{productId}/`. The three individual file inputs accept one file each; only Gallery accepts multiple files. In edit mode, untouched asset fields retain their existing paths. Selecting replacement files replaces the corresponding field, then removes its previous Storage objects after Firestore has been updated.

## Development

```sh
npm install
npm run dev
```
