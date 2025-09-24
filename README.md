# bank-app-common
## To Add module in repo
``` 
    git submodule add https://github.com/Suryadeep-bhujel/bank-app-common.git @bank-app-common
```

```
git submodule update --init --recursive
```
### To config in FE
```
 npm i -D vite-tsconfig-paths
```

```
### Register submodule path in alias

resolve: {
  alias: {
    '@bank-app-common': path.resolve(__dirname, 'c/src')
  },
  extensions: ['.ts', '.tsx', '.js', '.jsx']
}
```