git init Q4
cd Q4
touch a.txt
echo 'cse' > a.txt
git add a.txt
git commit -m "commit1"
mkdir 1
touch b.txt
echo 'ee' > b.txt
mv b.txt 1
git add 1
git commit -m "commit2"
mkdir 2
touch c.txt
mv c.txt 2
cp 1/b.txt 2/c.txt
git add 2
git commit -m "commit3"
rm -r 1
git add 1
git commit -m "commit4"
mkdir 3
touch d.txt
touch e.txt
mv d.txt 3
mv e.txt 3
cp a.txt 3/d.txt
cp 2/c.txt 3/e.txt
git add 3
rm -r 2
git add 2
git commit -m "commit5"
rm -rf a.txt
git add a.txt
git commit -m "commit6"
mkdir 4
touch f.txt
touch g.txt
mv f.txt 4
mv g.txt 4
cp 3/d.txt 4/f.txt
cp 3/d.txt 4/g.txt
rm -r 3
git add 3
git add 4
git commit -m "commit7"
git graph
