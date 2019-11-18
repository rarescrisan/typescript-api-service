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
    if [[ "$clean" == "true" || "$force" == "true" ]]; then
        echo "Clearing dependencies in $project"
        rm -rf node_modules
    fi
    if [[ "$force" == "true" ]]; then
        echo "Deleting the package-lock in file $project"
        rm -rf package-lock.json
    fi

    echo "Installing dependencies in $project"
    if [[ "$force" == "true" ]]; then
        npm install
    else
        npm ci
    fi
}

# Install all project dependencies.
do_install tools
do_install api
for package_dir in packages/*; do
    if [[ -d "$package_dir" ]]; then
        do_install $package_dir
        cd "$MASKFILE_DIR"
    fi
done

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

# Build all packages in a specific order
do_build packages/config-utils
do_build packages/logger
do_build packages/db-utils
do_build packages/http-utils
~~~





## run (npm_cmd)
> Run an npm cmd inside each package

~~~bash
# Run command inside each package
for package_dir in packages/*; do
    if [[ -d "$package_dir" ]]; then
        cd "$MASKFILE_DIR/$package_dir" && echo "Running inside $package_dir"
        npm run "$npm_cmd"
        cd "$MASKFILE_DIR"
    fi
done
~~~
