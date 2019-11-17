# Tasks





## dev
> Run the service and rebuild on file change

~~~bash
$MASK services start
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
$MASK clean
concurrently -p "[{name}]" \
    -n "TypeScript,Node,Config" -c "cyan.bold,green.bold,magenta.bold" \
    "tsc --watch --preserveWatchOutput" \
    "watchexec -w dist -w ../packages -w . --exts js,env -r '$MASK start -s'" \
    "watchexec -w config 'echo \"Updating config...\" && $MASK config dev'"
~~~





## start
> Build and run the service

**OPTIONS**
* only_start
    * flags: -s --only-start
    * desc: Skip building and starting the docker services

~~~bash
if [[ "$only_start" != "true" ]]; then
    $MASK config dev
    $MASK build
    $MASK services start
fi
set -a && source .env # Inject env vars
node dist/index.js
~~~





## build
> Build in production mode

~~~bash
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
$MASK clean
export NODE_ENV=production
tsc
~~~





## services

### services start
> Start all background docker dependencies

~~~bash
set -a && source .env # Inject env vars
cd docker && docker-compose up -d --build
# Sleep until the database is ready
until docker exec api_db psql $DB_NAME &>/dev/null; do
    echo "Waiting for the database to be ready..."
    sleep 1s
done
~~~





## image

### image publish
> Build, tag and publish a new docker image

~~~bash
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
set -a && source config/env.test # Inject env vars
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
if [[ "$clean" == "true" ]]; then
    jest --verbose --no-cache
elif [[ "$watch" == "true" ]]; then
    jest --verbose --watch
else
    jest --verbose
fi
~~~





## config (app_env)
> Generate config for a specific app environment (dev, docker, test)

~~~bash
cp "config/env.$app_env" .env
# Also append the gitignored local overrides config...
touch config/env.overrides
cat "config/env.overrides" >> .env
~~~





## create

### create migration (name)
> Create a new database migration

~~~bash
timestamp=$(date +"%Y%m%d%H%M%S")
filename="migrations/${timestamp}_${name// /-}.js"
echo "Creating new migration: $filename"

# Write a basic template
echo "exports.up = function(knex) {
    return knex.raw(\`\`);
};

exports.down = function(knex) {
    return knex.raw(\`\`);
};
" > "$filename"
~~~





## format

> Format the project

**OPTIONS**
* check
    * flags: -c --check
    * desc: Show which files are not formatted correctly

~~~bash
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
filter="{config,docker,lib,migrations,scripts,src,test,typings,.}/**/*.{js,jsx,ts,tsx,css,html,json,yml}"
if [[ $check == "true" ]]; then
    prettier $filter --list-different
else
    prettier $filter --write
fi
~~~





## lint
> Lint the project

~~~bash
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
eslint . --ext ts --ignore-pattern dist
~~~





## clean
> Cleans dist

~~~sh
rm -rf dist
mkdir dist
~~~
