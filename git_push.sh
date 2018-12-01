#!/bin/bash

read -p "输入本次迭代说明:" commit

git add -A

git commit -m "$commit"

git push
