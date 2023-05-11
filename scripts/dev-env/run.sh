#!/bin/bash

ARCH='uname -m'
if [ "$ARCH" == 'arm64' ]; then
    IMAGE="docker.io/saschl/fbw-test:latest"
else
    IMAGE="ghcr.io/flybywiresim/dev-env@sha256:52415c40545b88c820f61f5d0ce77178599288c3bc60adae57acc5435d19d98c"
fi

# only set `-it` if there is a tty
if [ -t 0 ] && [ -t 1 ];
then
    TTY_PARAM="-it"
fi

# Disable git-bash path conversion on windows
export MSYS_NO_PATHCONV=1

# ARCH='uname -m'
# if [ "$ARCH" == 'arm64' ]; then
#    PLATFORM='--platform=linux/amd64'
# else
#    PLATFORM=' '
# fi

docker image inspect $IMAGE 1> /dev/null || docker system prune --filter label=flybywiresim=true -f

docker run \
    --rm $TTY_PARAM \
    -e GITHUB_ACTIONS="${GITHUB_ACTIONS}" \
    -e GITHUB_ACTOR="${GITHUB_ACTOR}" \
    -e GITHUB_REF="${GITHUB_REF}" \
    -e GITHUB_SHA="${GITHUB_SHA}" \
    -v "$(pwd)":/external \
    # $PLATFORM \
    $IMAGE \
    "$@"
