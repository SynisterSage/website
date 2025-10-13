#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

const SRC = path.resolve(process.cwd(), 'public', 'icons', 'projects')
const DEST = path.resolve(process.cwd(), 'public', 'projects')

function slugify(name){
  return name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
}

async function ensureDir(p){
  try{ await fs.mkdir(p, { recursive: true }) }catch(e){}
}

async function run(){
  await ensureDir(DEST)
  const folders = await fs.readdir(SRC)
  for(const folder of folders){
    const srcFolder = path.join(SRC, folder)
    const stat = await fs.stat(srcFolder).catch(()=>null)
    if(!stat || !stat.isDirectory()) continue
    const files = await fs.readdir(srcFolder)
    if(!files.length) continue
    const slug = slugify(folder)
    const destFolder = path.join(DEST, slug)
    await ensureDir(destFolder)

    // Determine naming: first file -> thumbnail.ext, second -> main.ext, rest -> gallery-N.ext
    for(let i=0;i<files.length;i++){
      const file = files[i]
      const ext = path.extname(file).toLowerCase()
      const srcPath = path.join(srcFolder, file)
      let destName
      if(i===0) destName = `thumbnail${ext}`
      else if(i===1) destName = `main${ext}`
      else destName = `gallery-${i-1}${ext}`
      const destPath = path.join(destFolder, destName)
      // copy file (do not overwrite existing)
      try{
        await fs.copyFile(srcPath, destPath, fs.constants.COPYFILE_EXCL)
        console.log(`copied ${srcPath} -> ${destPath}`)
      }catch(err){
        if(err.code==='EEXIST') console.log(`skipped existing ${destPath}`)
        else console.error(`error copying ${srcPath}:`, err.message)
      }
    }
  }
}

run().catch(err=>{ console.error(err); process.exit(1) })
