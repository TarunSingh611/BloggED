// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return readingTime
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 min read'
  if (minutes === 1) return '1 min read'
  return `${minutes} min read`
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatContent(content: string): string {
  // First, handle inline code blocks (single backticks)
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>\n')
  
  // Handle multi-line code blocks (triple backticks)
  content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>\n')
  
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim())
  
  // Process each paragraph
  const formattedParagraphs = paragraphs.map(paragraph => {
    const trimmed = paragraph.trim()
    
    // Check if it's a heading (starts with #)
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^#+/)
      if (match) {
        const level = match[0].length
        const text = trimmed.replace(/^#+\s*/, '')
        return `<h${level}>${text}</h${level}>`
      }
    }
    
    // Check if it's a list item (starts with - or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2)
      return `<li>${content}</li>`
    }
    
    // Check if it's a numbered list item (starts with number.)
    if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s/, '')
      return `<li>${content}</li>`
    }
    
    // Check if it's a blockquote (starts with >)
    if (trimmed.startsWith('> ')) {
      const content = trimmed.substring(2)
      return `<blockquote>${content}</blockquote>`
    }
    
    // Check if it's already a code block
    if (trimmed.startsWith('<pre><code>') && trimmed.endsWith('</code></pre>')) {
      return trimmed
    }
    
    // Check if it's a comparison table or structured content
    if (trimmed.includes('|') && trimmed.includes('---')) {
      return formatTable(trimmed)
    }
    
    // Regular paragraph - split by sentences for better readability
    const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(s => s.trim())
    if (sentences.length > 1) {
      return sentences.map(sentence => `<p>${sentence.trim()}</p>`).join('')
    }
    
    return `<p>${trimmed}</p>`
  })
  
  // Group list items into lists
  let result = ''
  let inList = false
  let listType = ''
  
  for (let i = 0; i < formattedParagraphs.length; i++) {
    const item = formattedParagraphs[i]
    
    if (item.startsWith('<li>')) {
      if (!inList) {
        // Determine list type
        const originalParagraph = paragraphs[i]
        listType = originalParagraph.startsWith('- ') || originalParagraph.startsWith('* ') ? 'ul' : 'ol'
        result += `<${listType}>`
        inList = true
      }
      result += item
    } else {
      if (inList) {
        result += `</${listType}>`
        inList = false
      }
      result += item
    }
  }
  
  // Close any open list
  if (inList) {
    result += `</${listType}>`
  }
  
  return result
}

function formatTable(content: string): string {
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length < 2) return `<p>${content}</p>`
  
  let table = '<div class="overflow-x-auto"><table class="min-w-full border border-gray-300 dark:border-gray-600">'
  
  lines.forEach((line, index) => {
    const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell)
    
    if (index === 0) {
      // Header row
      table += '<thead><tr class="bg-gray-50 dark:bg-gray-800">'
      cells.forEach(cell => {
        table += `<th class="px-4 py-2 text-left border border-gray-300 dark:border-gray-600 font-semibold">${cell}</th>`
      })
      table += '</tr></thead>'
    } else if (line.includes('---')) {
      // Separator line - skip
      return
    } else {
      // Data row
      if (index === 1) table += '<tbody>'
      table += '<tr class="hover:bg-gray-50 dark:hover:bg-gray-700">'
      cells.forEach(cell => {
        table += `<td class="px-4 py-2 border border-gray-300 dark:border-gray-600">${cell}</td>`
      })
      table += '</tr>'
    }
  })
  
  table += '</tbody></table></div>'
  return table
}