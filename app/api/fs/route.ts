import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

type FileSystemItem = {
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileSystemItem[]
}

function readDirectory(dirPath: string): FileSystemItem[] {
  const items: FileSystemItem[] = []

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        items.push({
          name: entry.name,
          type: 'folder',
          children: readDirectory(fullPath)
        })
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        items.push({
          name: entry.name,
          type: 'file',
          content
        })
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error)
  }

  return items
}

export async function GET(request: NextRequest) {
  const archivePath = path.join(process.cwd(), 'archive-content')

  const fileSystem: FileSystemItem = {
    name: 'micahs-archive',
    type: 'folder',
    children: readDirectory(archivePath)
  }

  return NextResponse.json(fileSystem)
}
