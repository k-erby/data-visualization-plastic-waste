# Plastic Waste and the Environment

Starter repo for the Data Visualization course (SENG 480B/CSC 511) at UVic. 

## Dependencies
- node

## Tech Specs
- Mapbox
- Mapbox Studio
- node
- gulp
- scss

## Development
You'll need to install dev dependencies first. You'll need npm so 
the scss will compile nicely to css.

```bash
npm install
npm run build
```

After running the above `build` command, the repo will automatically load in your 
main browser. Any changes done to any html, scss, or js files will be automatically
updated, without the need to reload your browser.

### Installation
```bash
git clone https://github.com/k-erby/data-visualization-plastic-waste.git
```

### Local Usage

### Contributing

#### Branching
```bash
// Creating a branch
git checkout -b new-branch

// Adding after work
git add {$specific file names}
git commit -m "Description of Changes"
git push origin new-branch
```

#### Merging Code

```bash
# update your origin/* pointers
git fetch

# checkout the branch you’re merging in (assumes branch-name points to origin/branch-name)
git checkout branch-name

# rebase the whole branch onto master:
git rebase origin/master

# update origin/branch name to the new rebased head
git push --force-with-lease origin branch-name

# point your master branch to latest origin/master
git checkout master && git fetch && git reset --hard origin/master

# merge in the branch and force a ‘merge commit’
git merge --no-ff branch-name -m "Merge 'your-branch-name'"

# push your changes; this will automagically resolve the Github PR
git push origin master

# if no issue with merge, you can now delete the branch locally
git branch -d branch-name

# put this deleted branch back into origin
git push origin :branch-name
```



## Additional Sources

###
Data sets in csv format are found in `data` folder. The `json` folder has both a `json` of our
map-based dataset, as well as a `geojson` version of that and a `geojson` for the countries.

### Future Considerations
- deploy it so people can access it themselves. (heroku? serverless?)
- how to display different time ranges
- how to display difference in disposal/production of plastics
