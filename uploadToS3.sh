#!/bin/bash
set -xe

s3Key=$1
s3Secret=$2
tag=$3
folder="noVNC"
cdn="\/\/static-assets.codio.com\/${folder}\/${tag}"

replaceHtmlUrls () {
  sed -i "s/$1/$2/" "./vnc.html"
}

replaceTagVersion () {
  sed -i "s/TAG_VERSION/${tag}/" "./vnc.html"
}

replaceJsUrls () {
  sed -i "s/\.\/package\.json/${cdn}\/package\.json/" "./app/ui.js"
  sed -i "s/\"app\//\"${cdn}\/app\//" "./app/ui.js"
}

prepareSources () {
  replaceHtmlUrls "href=\"app\/" "href=\"${cdn}\/app\/"
  replaceHtmlUrls "src=\"app\/" "src=\"${cdn}\/app\/"
  replaceHtmlUrls "from \".\/" "from \"${cdn}\/"
  replaceHtmlUrls "from '.\/" "from '${cdn}\/"
  replaceHtmlUrls "fetch('.\/" "fetch('${cdn}\/"
  replaceTagVersion
  replaceJsUrls
}

readarray -d '' files < <(find ./ -type f -print0)

getContentType () {
  filename=$1
  extension=${filename##*.}
  contentType="application/octet-stream"

  case $extension in
    "html" | "css")
      contentType="text/${extension}"
      ;;
    "js")
      contentType="application/javascript"
      ;;
    "png" | "jpg" | "gif")
      contentType="image/${extension}"
      ;;
    "svg")
      contentType="image/svg+xml"
      ;;
    "ttf" | "woff" | "woff2")
      contentType="font/${extension}"
      ;;
  esac
  echo "$contentType"
}

uploadFile () {
  file=$1
  fName="${file#./}"
  contentType=$2
  bucket="codio-assets"
  resource="/${bucket}/${folder}/${tag}/${fName}"
  dateValue=$(date -R)
  stringToSign="PUT\n\n${contentType}\n${dateValue}\n${resource}"
  signature=$(echo -en "${stringToSign}" | openssl sha1 -hmac "${s3Secret}" -binary | base64)
  curl -X PUT -T "${file}" \
    -H "Host: ${bucket}.s3.amazonaws.com" \
    -H "Date: ${dateValue}" \
    -H "Content-Type: ${contentType}" \
    -H "Authorization: AWS ${s3Key}:${signature}" \
    https://${bucket}.s3.amazonaws.com/"${folder}"/"${tag}"/"${fName}" || exit 1
}

prepareSources

for file in "${files[@]}"
do
  contentType=$(getContentType "$file")
  uploadFile "$file" "$contentType"
done
