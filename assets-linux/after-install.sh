#!/bin/bash

# Link to the binary
ln -sf /opt/progen/ProGen /usr/local/bin/progen

# Launcher icon
desktop-file-install /opt/progen/progen.desktop
