# Tasks





## dev
> Start the dev server

~~~sh
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
$MASK clean
concurrently -p "[{name}]" \
    -n "TypeScript,Node,Config" -c "cyan.bold,green.bold,magenta.bold" \
    "tsc --watch --preserveWatchOutput" \
    "watchexec -w dist -w ../packages -w . --exts js,env -r 'node dist/index.js'" \
    "watchexec -w config -r 'echo \"Updating config...\" && $MASK config dev'"
~~~





## build
> Build in production mode

~~~sh
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
$MASK clean
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
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
$MASK clean

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
cp "$MASKFILE_DIR/config/env.$app_env" .env
# Also append the gitignored local overrides config...
cat "$MASKFILE_DIR/config/env.local" >> .env
~~~





## create

### create migration (name)
> Create a new database migration

~~~sh
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

~~~sh
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
glob1="{config,lib,migrations,scripts,src,test,typings}/**/*.{js,jsx,ts,tsx,css,html,json}"
glob2="*.{js,jsx,ts,tsx,css,html,json}"

$MASK clean
if [[ $check == "true" ]]; then
    prettier $glob1 $glob2 --list-different
else
    prettier $glob1 $glob2 --write
fi
~~~





## lint
> Lint the project

~~~sh
export PATH="../node_modules/.bin:$PATH" # Add node modules to path
$MASK clean
eslint . --ext ts --ignore-pattern dist
~~~





## clean
> Cleans dist

~~~sh
rm -rf dist
mkdir dist
~~~
