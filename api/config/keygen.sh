#!/bin/bash

PRIVATE_KEY_FILE="private.pem"
PUBLIC_KEY_FILE="public.pem"

print_usage() {
	echo "Usage: $0 [ -o private key output file ] [ -p public key output file ]"
}

exit_error() {
	print_usage
	exit 1
}

while getopts ":o:p:" opts; do
	case "$opts" in
		o)
			PRIVATE_KEY_FILE=${OPTARG}
			;;
		p)
			PUBLIC_KEY_FILE=${OPTARG}
			;;
		:)
			echo "Error: -$OPTARG requires an argument."
			exit_error
			;;
		*)
			exit_error
			;;
	esac
done

openssl genpkey -out $PRIVATE_KEY_FILE -algorithm RSA -pkeyopt rsa_keygen_bits:2048
openssl pkey -in $PRIVATE_KEY_FILE -pubout -out $PUBLIC_KEY_FILE
echo "Generated private/public keys."

