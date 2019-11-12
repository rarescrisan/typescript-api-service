# Tasks





## dev
> Start the dev server

~~~sh
export PATH="node_modules/.bin:$PATH" # Add node modules to path
$MASK clean
$MASK config dev
tsc # Build once before starting the service...
concurrently -k -p "[{name}]" \
    -n "TypeScript,Node" -c "cyan.bold,green.bold" \
    "tsc --watch" \
    "nodemon --watch dist --watch ../packages/**/dist --watch .env --exec 'node dist/index.js'"
~~~





## build
> Build in production mode

~~~sh
export PATH="node_modules/.bin:$PATH" # Add node modules to path
$MASK clean
$MASK config prod
export NODE_ENV=production
tsc
~~~





## image

### image publish
> Build, tag and publish a new docker image

~~~sh
# Pulls the npm package's version field (v1.2.3)
version=v$(shell npm run env | grep "npm_package_version" | cut -d "=" -f2)
img_name=api-service
latest_tag=$(img_name):latest
version_tag=$(img_name):$(version)
ecr_url=xxxxxxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/$(version_tag)

docker build \
    -t $(latest_tag) \
    -t $(version_tag) \
    -f ./Dockerfile .

# Tag and push to ECR
docker tag $version_tag $ecr_url
docker push $ecr_url
~~~





## test

> Run the test suite

**OPTIONS**
* clean
    * flags: -c --clean
    * desc: Clear the jest cache
* watch
    * flags: -w --watch
    * desc: Start jest in watch mode

~~~bash
export PATH="node_modules/.bin:$PATH" # Add node modules to path
$MASK clean

if [[ "$clean" == "true" ]]; then
    jest --verbose --no-cache
elif [[ "$watch" == "true" ]]; then
    jest --verbose --watch
else
    jest --verbose
fi
~~~





## db

### db migrate
> Migrate the local database

~~~sh
export PATH="node_modules/.bin:$PATH" # Add node modules to path
$MASK config dev
knex migrate:latest
echo "✅ DONE MIGRATING DATABASE"
~~~





## config (app_env)
> Generate config for a specific app environment (dev, docker, test)

~~~bash
cp "$MASKFILE_DIR/config/env.$app_env.sh" .env
# Also append the gitignored local overrides config...
cat "$MASKFILE_DIR/config/env.local.sh" >> .env
~~~





## format

> Format the project

**OPTIONS**
* check
    * flags: -c --check
    * desc: Show which files are not formatted correctly

~~~sh
export PATH="node_modules/.bin:$PATH" # Add node modules to path
format="prettier '{config,lib,migrations,scripts,src,test,typings}/**/*.{js,jsx,ts,tsx,css,html,json}' '*.{js,jsx,ts,tsx,css,html,json}'"

$MASK clean
if [[ $check == "true" ]]; then
    $format --list-different
else
    $format --write
fi
~~~





## lint
> Lint the project

~~~sh
export PATH="node_modules/.bin:$PATH" # Add node modules to path
$MASK clean
eslint . --ext ts,js --ignore-pattern dist
~~~





## clean
> Cleans dist

~~~sh
rm -rf dist
~~~
