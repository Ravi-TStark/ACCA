cd 'Question2_Assn1'

for databaseName in $(ls .git/objects); do
    echo $databaseName
done

exit