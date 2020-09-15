cd 'FOLDER_NAME'

echo $"\n"
for databaseName in $(ls .git/objects); do
    STRING=$(ls .git/objects/$databaseName)
    OUT=$(echo "$databaseName${STRING:0:4}")

    if [ ${#OUT} -ge 6 ]; then echo $"Type: $(git cat-file -t $OUT) \n"
    echo $"Content: \n$(git cat-file -p $OUT) \n\n"
    fi
done

exit