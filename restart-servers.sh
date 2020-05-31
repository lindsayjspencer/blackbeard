#!/bin/bash

echo "//BB> Restarting Blackbeard servers"
sudo systemctl restart bb-web.service bb-json.db.service
