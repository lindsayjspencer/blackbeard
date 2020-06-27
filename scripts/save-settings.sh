#!/bin/bash

echo "Restaring daemon service"
echo "// Insert transmission settings file"
sudo cp ../lib/transmission.settings.json /etc/transmission-daemon/settings.json
echo "> Saved."
sudo /etc/init.d/transmission-daemon start
echo "> Daemon service restarted."
