 - tsconfig.json
 - include after adding code

 "paths": {
      "@payload-config": [
        "./src/payload.config.ts"
      ],
      "react": [
        "./node_modules/@types/react"
      ],
      "@/*": [
        "./src/*"
      ],
      "@cms/*": [
        "./src/app/(frontend)/(auth)/cms/*"
      ],
      "@accounts/*":[
        "./src/app/(frontend)/(auth)/accounts/*" 
      ]
    }