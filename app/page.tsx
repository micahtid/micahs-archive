'use client'

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type FileSystemItem = {
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileSystemItem[]
}

const Home = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState<string[]>(['micahs-archive'])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [history, setHistory] = useState<string[][]>([['micahs-archive']])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [viewingFile, setViewingFile] = useState<string | null>(null)
  const [viewingFileName, setViewingFileName] = useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/fs')
      .then(res => res.json())
      .then(data => {
        setFileSystem(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading file system:', error)
        setLoading(false)
      })
  }, [])

  const getCurrentFolder = (): FileSystemItem => {
    if (!fileSystem) return { name: 'micahs-archive', type: 'folder', children: [] }
    let current = fileSystem
    for (let i = 1; i < currentPath.length; i++) {
      const child = current.children?.find(item => item.name === currentPath[i])
      if (child && child.type === 'folder') {
        current = child
      }
    }
    return current
  }

  const getCurrentItems = (): FileSystemItem[] => {
    if (!fileSystem) return []
    const folder = getCurrentFolder()
    return folder.children || []
  }

  const items = getCurrentItems()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewingFile) {
        const fileViewer = document.querySelector('.file-viewer')
        const isUpKey = e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W'
        const isDownKey = e.key === 'ArrowDown' || e.key === 's' || e.key === 'S'

        if (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          setViewingFile(null)
          setViewingFileName(null)
        } else if (isUpKey && fileViewer) {
          e.preventDefault()
          fileViewer.scrollBy({ top: -40, behavior: 'smooth' })
        } else if (isDownKey && fileViewer) {
          e.preventDefault()
          fileViewer.scrollBy({ top: 40, behavior: 'smooth' })
        }
        return
      }

      const isUpKey = e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W'
      const isDownKey = e.key === 'ArrowDown' || e.key === 's' || e.key === 'S'
      const isLeftKey = e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A'
      const isRightKey = e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D'

      if (isUpKey) {
        e.preventDefault()
        setSelectedIndex(prev => {
          // If no keyboard selection, start from hovered item or wrap to end
          if (prev === -1) {
            return hoveredIndex !== null ? hoveredIndex : items.length - 1
          }
          return Math.max(0, prev - 1)
        })
        setHoveredIndex(null)
      } else if (isDownKey) {
        e.preventDefault()
        setSelectedIndex(prev => {
          // If no keyboard selection, start from hovered item or start at beginning
          if (prev === -1) {
            return hoveredIndex !== null ? hoveredIndex : 0
          }
          return Math.min(items.length - 1, prev + 1)
        })
        setHoveredIndex(null)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = items[selectedIndex]
        if (selected && selectedIndex !== -1) {
          if (selected.type === 'folder') {
            const newPath = [...currentPath, selected.name]
            setCurrentPath(newPath)
            setSelectedIndex(-1)
            const newHistory = history.slice(0, historyIndex + 1)
            newHistory.push(newPath)
            setHistory(newHistory)
            setHistoryIndex(newHistory.length - 1)
          } else {
            setViewingFile(selected.content || '')
            setViewingFileName(selected.name)
          }
        }
      } else if (isLeftKey) {
        e.preventDefault()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setCurrentPath(history[newIndex])
          setSelectedIndex(-1)
        } else if (currentPath.length > 1) {
          const newPath = currentPath.slice(0, -1)
          setCurrentPath(newPath)
          setSelectedIndex(-1)
          const newHistory = history.slice(0, historyIndex + 1)
          newHistory.push(newPath)
          setHistory(newHistory)
          setHistoryIndex(newHistory.length - 1)
        }
      } else if (isRightKey) {
        e.preventDefault()
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          setCurrentPath(history[newIndex])
          setSelectedIndex(-1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, hoveredIndex, items, currentPath, history, historyIndex, viewingFile])

  useEffect(() => {
    setSelectedIndex(-1)
    setHoveredIndex(null)
  }, [currentPath])

  if (loading) {
    return (
      <div className="terminal-container">
        <div className="terminal-content">
          <div className="terminal-header">
            <div className="terminal-path">/micahs-archive</div>
            <div className="terminal-description">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (viewingFile) {
    return (
      <div className="terminal-container">
        <div className="terminal-content">
          <div className="terminal-header">
            <div className="terminal-path">
              /{currentPath.map((segment, index) => (
                <span key={index}>
                  <span
                    className="breadcrumb-link"
                    onClick={() => {
                      const newPath = currentPath.slice(0, index + 1)
                      setCurrentPath(newPath)
                      setViewingFile(null)
                      setViewingFileName(null)
                      setSelectedIndex(-1)
                      const newHistory = history.slice(0, historyIndex + 1)
                      newHistory.push(newPath)
                      setHistory(newHistory)
                      setHistoryIndex(newHistory.length - 1)
                    }}
                  >
                    {segment}
                  </span>
                  {index < currentPath.length - 1 && '/'}
                </span>
              ))}
              {viewingFileName ? `/${viewingFileName}` : ''}
            </div>
            <div className="terminal-description">Micah&apos;s developer tools</div>
          </div>
          <div className="file-viewer">
            <div className="file-content markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {viewingFile}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="terminal-container">
      <div className="terminal-content">
        <div className="terminal-header">
          <div className="terminal-path">
            /{currentPath.map((segment, index) => (
              <span key={index}>
                <span
                  className="breadcrumb-link"
                  onClick={() => {
                    const newPath = currentPath.slice(0, index + 1)
                    setCurrentPath(newPath)
                    setSelectedIndex(-1)
                    const newHistory = history.slice(0, historyIndex + 1)
                    newHistory.push(newPath)
                    setHistory(newHistory)
                    setHistoryIndex(newHistory.length - 1)
                  }}
                >
                  {segment}
                </span>
                {index < currentPath.length - 1 && '/'}
              </span>
            ))}
          </div>
          <div className="terminal-description">Micah&apos;s developer tools</div>
        </div>

        <div className="terminal-list">
          {items.map((item, index) => (
            <div
              key={item.name}
              className={`terminal-item ${
                index === selectedIndex || index === hoveredIndex ? 'highlighted' : ''
              }`}
              onMouseEnter={() => {
                setHoveredIndex(index)
                if (selectedIndex !== index) {
                  setSelectedIndex(-1)
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                if (item.type === 'folder') {
                  const newPath = [...currentPath, item.name]
                  setCurrentPath(newPath)
                  setSelectedIndex(-1)
                  const newHistory = history.slice(0, historyIndex + 1)
                  newHistory.push(newPath)
                  setHistory(newHistory)
                  setHistoryIndex(newHistory.length - 1)
                } else {
                  setViewingFile(item.content || '')
                  setViewingFileName(item.name)
                }
              }}
            >
              <span className="terminal-item-icon">
                {item.type === 'folder' ? '📁' : '📄'}
              </span>
              <span className="terminal-item-name">{item.name}</span>
              {item.type === 'folder' && (
                <span className="terminal-item-indicator">/</span>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="terminal-empty">
            Empty directory
          </div>
        )}
      </div>
    </div>
  )
}

export default Home