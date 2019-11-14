# Tasks

Commands for the entire monorepo.





## bootstrap
> Installs all dependencies and builds all packages

~~~bash
$MASK install
$MASK build
~~~





## install
> Install all dependencies

**OPTIONS**
* clean
    * flags: -c --clean
    * desc: Clean install
* force
    * flags: -f --force
    * desc: Delete the package-lock file

~~~bash
do_install() {
    project="$1"
    cd "$MASKFILE_DIR/$project"
    if [[ "$clean" == "true" ]]; then
        echo "Clearing dependencies in $project"
        rm -rf node_modules
    fi
    if [[ "$force" == "true" ]]; then
        echo "Deleting the package lock in file $project"
        rm -rf package-lock.json
    fi
    echo "Installing dependencies in $project"
    npm install
}

# Install all project dependencies.
do_install tools
do_install api
do_install packages/config-loader
do_install packages/logger
do_install packages/db-utils
do_install packages/http-utils

# Create a node_modules symlink to the packages directory
# so our projects can share core dependencies.
cd $MASKFILE_DIR
rm -rf node_modules
mv tools/node_modules . # Move global tools to the root
ln -s "$MASKFILE_DIR/packages/" ./node_modules/@
~~~





## build
> Build all packages

~~~bash
do_build() {
    project="$1"
    cd "$MASKFILE_DIR/$project"
    echo "Building $project"
    npm run build
}

# Build all packages
do_build packages/config-loader
do_build packages/logger
do_build packages/db-utils
do_build packages/http-utils
~~~
