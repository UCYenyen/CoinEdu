# UI Rules
1. when using popup modal, the background is blured
2. use flex over grid
3. use same UI style with previous/other pages UI style

# Logic Rules
1. remove unused import
2. make sure there is no linting or typescript error
3. make sure it using clean architecture (Feature-Based Architecture)
4. if there are many action in one feature, create a new folder for groups of actions
5. if it need an interface, create a separate file for it
6. if there are many interface file, create a folder for groups of interfaces
7. if it need a component, create a separate file for it
8. if there are many component file, create a folder for groups of components
9. make sure it use efficient code, especially when using external api like freecryptoapi and groq api

# Environtments
1. use pnpm as package manager
2. we use freecryptoapi for crypto data
3. we use groq api for AI Assistant feature   