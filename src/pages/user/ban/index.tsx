// import { useEffect, useRef, useState } from "react"
// import styles from "./index.module.scss"

// // 随机颜色
// const randomColor = (min = 0, max = 255) => {
//   const r = Math.floor(Math.random() * (max - min) + min)
//   const g = Math.floor(Math.random() * (max - min) + min)
//   const b = Math.floor(Math.random() * (max - min) + min)
//   return `rgb(${r},${g},${b})`
// }

// // 随机数
// const randomNum = (min: number, max: number) =>
//   Math.floor(Math.random() * (max - min) + min)

// // 生成随机验证码字符
// const randomStr = () => {
//   const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789'
//   let str = ''
//   for (let i = 0; i < 4; i++) {
//     str += chars[randomNum(0, chars.length)]
//   }
//   return str
// }

// export default function Login() {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const [code, setCode] = useState('')         // 当前验证码
//   const [inputVal, setInputVal] = useState('') // 用户输入
//   const [msg, setMsg] = useState('')           // 提示信息

//   // 绘制验证码
//   const drawCaptcha = () => {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ctx = canvas.getContext('2d')
//     if (!ctx) return

//     const width = canvas.width
//     const height = canvas.height
//     const newCode = randomStr()
//     setCode(newCode)

//     // 清空画布
//     ctx.clearRect(0, 0, width, height)

//     // 画背景
//     ctx.fillStyle = '#f5f5f5'
//     ctx.fillRect(0, 0, width, height)

//     // 画干扰线
//     for (let i = 0; i < 4; i++) {
//       ctx.strokeStyle = randomColor(100, 200)
//       ctx.lineWidth = 1
//       ctx.beginPath()
//       ctx.moveTo(randomNum(0, width), randomNum(0, height))
//       ctx.lineTo(randomNum(0, width), randomNum(0, height))
//       ctx.stroke()
//     }

//     // 画干扰点
//     for (let i = 0; i < 30; i++) {
//       ctx.fillStyle = randomColor()
//       ctx.beginPath()
//       ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, Math.PI * 2)
//       ctx.fill()
//     }

//     // 画验证码文字
//     newCode.split('').forEach((char, i) => {
//       ctx.save()
//       ctx.font = `bold ${randomNum(20, 28)}px Arial`
//       ctx.fillStyle = randomColor(50, 150)
//       // 每个字符位置
//       ctx.translate(20 + i * 30, height / 2 + 8)
//       // 随机倾斜
//       ctx.rotate((randomNum(-30, 30) * Math.PI) / 180)
//       ctx.fillText(char, 0, 0)
//       ctx.restore()
//     })
//   }

//   useEffect(() => {
//     drawCaptcha()
//   }, [])

//   // 验证
//   const handleVerify = () => {
//     if (inputVal.toLowerCase() === code.toLowerCase()) {
//       setMsg('✅ 验证成功！')
//     } else {
//       setMsg('❌ 验证码错误，请重试')
//       drawCaptcha()   // 刷新验证码
//       setInputVal('')
//     }
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <p style={{ marginBottom: 8 }}>请输入验证码</p>

//       {/* 验证码画布 + 刷新按钮 */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
//         <canvas
//           ref={canvasRef}
//           width={140}
//           height={40}
//           style={{ borderRadius: 4, cursor: 'pointer', border: '1px solid #ddd' }}
//           onClick={drawCaptcha}  // 点击刷新
//         />
//         <span
//           style={{ fontSize: 13, color: '#1890ff', cursor: 'pointer' }}
//           onClick={drawCaptcha}
//         >
//           看不清？换一张
//         </span>
//       </div>

//       {/* 输入框 */}
//       <div style={{ display: 'flex', gap: 8 }}>
//         <input
//           value={inputVal}
//           onChange={e => setInputVal(e.target.value)}
//           placeholder="请输入验证码"
//           style={{
//             width: 140, height: 36, padding: '0 10px',
//             border: '1px solid #ddd', borderRadius: 4, fontSize: 14
//           }}
//           // 按回车也能验证
//           onKeyDown={e => e.key === 'Enter' && handleVerify()}
//         />
//         <button
//           onClick={handleVerify}
//           style={{
//             padding: '0 16px', height: 36,
//             background: '#1890ff', color: '#fff',
//             border: 'none', borderRadius: 4, cursor: 'pointer'
//           }}
//         >
//           验证
//         </button>
//       </div>

//       {/* 提示信息 */}
//       {msg && (
//         <p style={{ marginTop: 8, fontSize: 13, color: msg.includes('成功') ? 'green' : 'red' }}>
//           {msg}
//         </p>
//       )}
//     </div>
//   )
// }

import { useEffect, useRef, useState, useCallback } from "react"
import {postFile} from "@/services/ban"

const CHARS = 'ABCDEFGHJKMNPQRSTWXYZ'
const COLORS = ['#E24B4A','#185FA5','#3B6D11','#854F0B','#7F77DD','#D85A30']
const W = 300, H = 160

const randInt = (a: number, b: number) => Math.floor(Math.random() * (b - a) + a)
const randItem = (arr: string[]) => arr[randInt(0, arr.length)]
const shuffle = <T,>(arr: T[]) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface CharItem {
  char: string
  isTarget: boolean
  order: number
  x: number
  y: number
}

interface Marker {
  x: number
  y: number
  index: number
}

// 文件拖拽功能
interface FileItem {
  id: number
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
}

const EXT_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  jpg:  { bg: '#FFF0F0', color: '#A32D2D', label: 'IMG' },
  jpeg: { bg: '#FFF0F0', color: '#A32D2D', label: 'IMG' },
  png:  { bg: '#EAF3DE', color: '#3B6D11', label: 'PNG' },
  pdf:  { bg: '#FCEBEB', color: '#A32D2D', label: 'PDF' },
  zip:  { bg: '#FAEEDA', color: '#854F0B', label: 'ZIP' },
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

const getExt = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

export default function ImageCaptcha({ onSuccess }: { onSuccess?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [targetChars, setTargetChars] = useState<string[]>([])
  const [allChars, setAllChars] = useState<CharItem[]>([])
  const [clickedOrder, setClickedOrder] = useState<string[]>([])
  const [markers, setMarkers] = useState<Marker[]>([])
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [verified, setVerified] = useState(false)


  // 文件拖拽功能
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    const items: FileItem[] = []
    Array.from(newFiles).forEach(f => {
      if (f.size > 10 * 1024 * 1024) {
        alert(f.name + ' 超过 10MB 限制')
        return
      }
      items.push({ id: Date.now() + Math.random(), file: f, progress: 0, status: 'pending' })
    })
    setFiles(prev => {
      const names = new Set(prev.map(x => x.file.name + x.file.size))
      return [...prev, ...items.filter(i => !names.has(i.file.name + i.file.size))]
    })
  }, [])

  const removeFile = (id: number) => setFiles(prev => prev.filter(f => f.id !== id))

  // 模拟上传进度（替换成真实接口）
  const handleUpload = async () => {
  for (const item of files) {
    if (item.status !== 'pending') continue

    const formData = new FormData()
    formData.append('file', item.file)
    console.log(item.file,"files",formData)
    try {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploading' } : f))

      const res = await postFile( formData, { //修改为真实接口
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total ?? 1))
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: percent } : f))
        }
      })
      console.log(res,'res')
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'done', progress: 100 } : f))
    } catch {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error' } : f))
    }
  }
}

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const allDone = files.length > 0 && files.every(f => f.status === 'done')
  const hasUploading = files.some(f => f.status === 'uploading')


  // 画验证码
  const drawCanvas = useCallback((chars: CharItem[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#f0ede8'
    ctx.fillRect(0, 0, W, H)

    // 干扰曲线
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = `rgba(${randInt(100,180)},${randInt(100,180)},${randInt(100,180)},0.35)`
      ctx.lineWidth = randInt(1, 2)
      ctx.beginPath()
      ctx.moveTo(randInt(0, W), randInt(0, H))
      ctx.bezierCurveTo(randInt(0,W),randInt(0,H),randInt(0,W),randInt(0,H),randInt(0,W),randInt(0,H))
      ctx.stroke()
    }

    // 干扰点
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(${randInt(80,180)},${randInt(80,180)},${randInt(80,180)},0.25)`
      ctx.beginPath()
      ctx.arc(randInt(0,W), randInt(0,H), randInt(1, 3), 0, Math.PI * 2)
      ctx.fill()
    }

    // 绘制字符
    chars.forEach(item => {
      ctx.save()
      ctx.translate(item.x, item.y)
      ctx.rotate((randInt(-25, 25) * Math.PI) / 180)
      ctx.font = `bold ${randInt(22, 30)}px Arial`
      ctx.fillStyle = randItem(COLORS)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(item.char, 0, 0)
      ctx.restore()
    })
  }, [])

  // 初始化
  const initCaptcha = useCallback(() => {
    setVerified(false)
    setClickedOrder([])
    setMarkers([])
    setStatus('idle')

    const pool = shuffle(CHARS.split('')).slice(0, 6)
    const targets = pool.slice(0, 3)
    const decoys = pool.slice(3)

    const chars: CharItem[] = shuffle([
      ...targets.map((c, i) => ({ char: c, isTarget: true, order: i, x: 0, y: 0 })),
      ...decoys.map(c => ({ char: c, isTarget: false, order: -1, x: 0, y: 0 }))
    ])

    // 随机不重叠位置
    const placed: { x: number; y: number }[] = []
    chars.forEach(item => {
      let x = 0, y = 0, tries = 0
      do {
        x = randInt(28, W - 28)
        y = randInt(28, H - 28)
        tries++
      } while (tries < 50 && placed.some(p => Math.abs(p.x - x) < 44 && Math.abs(p.y - y) < 36))
      item.x = x
      item.y = y
      placed.push({ x, y })
    })

    setTargetChars(targets)
    setAllChars(chars)
    setTimeout(() => drawCanvas(chars), 0)
  }, [drawCanvas])

  useEffect(() => { initCaptcha() }, [initCaptcha])

  // 点击画布
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (verified) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = W / rect.width
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleX

    const nextIdx = clickedOrder.length
    if (nextIdx >= targetChars.length) return

    const hit = allChars.find(item =>
      Math.abs(item.x - mx) < 22 && Math.abs(item.y - my) < 22
    )
    if (!hit) return

    setMarkers(prev => [...prev, { x: hit.x, y: hit.y, index: nextIdx }])

    if (hit.isTarget && hit.order === nextIdx) {
      const newOrder = [...clickedOrder, hit.char]
      setClickedOrder(newOrder)
      if (newOrder.length === targetChars.length) {
        setVerified(true)
        setStatus('success')
      }
    } else {
      setStatus('error')
      setTimeout(() => initCaptcha(), 900)
    }
  }

  const handleSubmit = () => {
    if (!verified) return
    onSuccess?.()
  }

// 文件拖拽功能


  return (
   <div>
     <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0', padding: 20, width: 340 }}>
      <p style={{ fontSize: 13, color: '#999', margin: '0 0 10px' }}>安全验证</p>
      <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 10px', color: '#1a1a1a' }}>
        请依次点击图中的字符
      </p>

      {/* 目标字符 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {targetChars.map((c, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 500,
            background: clickedOrder[i] ? '#f0f9eb' : '#f5f5f5',
            border: `1px solid ${clickedOrder[i] ? '#52c41a' : '#e8e8e8'}`,
            color: clickedOrder[i] ? '#52c41a' : '#1a1a1a',
            transition: 'all 0.2s'
          }}>
            {c}
          </div>
        ))}
      </div>

      {/* 画布 */}
      <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1px solid #f0f0f0', marginBottom: 10 }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ display: 'block', width: '100%', cursor: 'crosshair' }}
          onClick={handleCanvasClick}
        />
        {/* 点击标记 */}
        {markers.map((m, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(m.x / W * 100).toFixed(1)}%`,
            top: `${(m.y / H * 100).toFixed(1)}%`,
            width: 24, height: 24,
            borderRadius: '50%',
            background: '#1890ff',
            border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 500, color: '#fff',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}>
            {m.index + 1}
          </div>
        ))}
      </div>

      {/* 底部状态 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontSize: 13,
          color: status === 'success' ? '#52c41a' : status === 'error' ? '#ff4d4f' : '#999'
        }}>
          {status === 'success' ? '验证通过，点击确认' :
           status === 'error' ? '顺序有误，请重新验证' :
           '点击图中对应字符完成验证'}
        </span>
        <span style={{ fontSize: 13, color: '#1890ff', cursor: 'pointer' }} onClick={initCaptcha}>
          换一题
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!verified}
        style={{
          width: '100%', padding: '9px 0',
          borderRadius: 6, border: 'none',
          background: verified ? '#1890ff' : '#f5f5f5',
          color: verified ? '#fff' : '#bbb',
          fontSize: 14, cursor: verified ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s'
        }}
      >
        确认验证
      </button>
    </div>
    // 拖拽文件上传功能
     <div style={{ padding: 20 }}>
      {/* 拖拽区域 */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `1.5px dashed ${isDragOver ? '#1890ff' : '#d9d9d9'}`,
          borderRadius: 8,
          background: isDragOver ? '#e6f4ff' : '#fafafa',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px 20px', cursor: 'pointer',
          transition: 'all 0.2s', minHeight: 160,
        }}
      >
        {/* 上传图标 */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ marginBottom: 12 }}>
          <rect width="44" height="44" rx="10" fill={isDragOver ? '#BAE0FF' : '#f0f0f0'} />
          <path d="M22 28V16M22 16L18 20M22 16L26 20" stroke="#1890ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 30h16" stroke="#1890ff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 4px', color: '#1a1a1a' }}>
          拖拽文件到此处上传
        </p>
        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
          或 <span style={{ color: '#1890ff' }}>点击选择文件</span> · 支持 JPG、PNG、PDF、ZIP，最大 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.zip"
          style={{ display: 'none' }}
          onChange={e => { addFiles(e.target.files); e.target.value = '' }}
          onClick={e => e.stopPropagation()}
        />
      </div>

      {/* 文件列表 */}
      {files.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map(item => {
            const ext = getExt(item.file.name)
            const style = EXT_COLOR[ext] ?? { bg: '#f5f5f5', color: '#666', label: ext.toUpperCase().slice(0, 3) }
            return (
              <div key={item.id} style={{
                background: '#fff', border: '1px solid #f0f0f0',
                borderRadius: 8, padding: '10px 12px',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                {/* 文件类型图标 */}
                <div style={{
                  width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                  background: style.bg, color: style.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 500
                }}>
                  {style.label}
                </div>

                {/* 文件信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.file.name}
                  </p>
                  <p style={{ fontSize: 11, color: '#999', margin: 0 }}>
                    {formatSize(item.file.size)}
                  </p>
                  {(item.status === 'uploading' || item.status === 'done') && (
                    <div style={{ height: 3, background: '#f0f0f0', borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.progress}%`, background: '#1890ff', borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                  )}
                </div>

                {/* 状态 */}
                <span style={{
                  fontSize: 11, flexShrink: 0,
                  color: item.status === 'done' ? '#52c41a' : item.status === 'uploading' ? '#1890ff' : '#999'
                }}>
                  {item.status === 'done' ? '完成' : item.status === 'uploading' ? '上传中' : '待上传'}
                </span>

                {/* 删除按钮 */}
                <div
                  onClick={() => removeFile(item.id)}
                  style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: '1px solid #e8e8e8', background: '#f5f5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: 12, color: '#999', flexShrink: 0
                  }}
                >
                  ×
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 上传按钮 */}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || hasUploading || allDone}
        style={{
          marginTop: 12, width: '100%', padding: '9px 0',
          borderRadius: 8, border: 'none', fontSize: 14, cursor: 'pointer',
          background: files.length === 0 || hasUploading || allDone ? '#f5f5f5' : '#1890ff',
          color: files.length === 0 || hasUploading || allDone ? '#bbb' : '#fff',
          transition: 'all 0.2s'
        }}
      >
        {allDone ? '全部上传完成' : hasUploading ? '上传中...' : '上传文件'}
      </button>
    </div>
   </div>
  )
}