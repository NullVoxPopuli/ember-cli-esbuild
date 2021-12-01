#!/bin/bash
#
# To debug, run this with --runInBand
# To see ember build output, run this with DEBUG_EMBER=true

NODE_OPTIONS="--experimental-vm-modules --trace-warnings" yarn jest --config ./jest.config.js $@
