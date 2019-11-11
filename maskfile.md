# Tasks

Commands for the entire monorepo.





## install
> Install all dependencies

**OPTIONS**
* clean
    * flags: -c --clean
    * desc: Clean install

~~~bash
do_install() {
    project="$1"
    cd "$MASKFILE_DIR/$project"
    if [[ "$clean" == "true" ]]; then
        echo "Clearing dependencies in $project"
        rm -rf node_modules
    fi
    echo "Installing dependencies in $project"
    npm install
}

# Install all project dependencies.
do_install api
do_install packages/http-utils

# Create a node_modules symlink to the packages directory
# so our projects can share core dependencies.
cd $MASKFILE_DIR
rm -rf node_modules
mkdir node_modules
ln -s "$MASKFILE_DIR/packages/" ./node_modules/@jakedeichert
~~~
