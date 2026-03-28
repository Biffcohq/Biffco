import { useState, useEffect } from 'react'
import { useSignupStore } from '../../stores/useSignupStore'
import { IconArrowLeft, IconArrowRight, IconKey, IconDownload, IconShieldLock, IconCopy, IconCheck, IconLoader2 } from '@tabler/icons-react'

export function Step2Mnemonic() {
  const store = useSignupStore()
  
  const [mnemonic, setMnemonic] = useState('')
  const [copied, setCopied] = useState(false)
  const [hasBackedUp, setHasBackedUp] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)
  const [keys, setKeys] = useState<{ publicKey: string, privateKey: string } | null>(null)
  
  // Generate Mnemonic and Keys on Mount
  useEffect(() => {
    let mounted = true
    const initCrypto = async () => {
      // Si el Store ya tiene public key validamos si mantenerla,
      // pero por seguridad regeneramos si entraron aca. 
      // O podríamos guardarlo en el store por si navegan adelante y atras.
      if (store.publicKey && mnemonic !== '') return 
      
      const bip39Module = await import('bip39')
      const edKeyModule = await import('ed25519-hd-key')
      const sodiumModule = await import('libsodium-wrappers')
      await sodiumModule.default.ready
      const sodium = sodiumModule.default
      
      // 1. Generate 12 words
      const words = bip39Module.generateMnemonic()
      
      // 2. Derive Seed
      const seed = bip39Module.mnemonicToSeedSync(words)
      
      // 3. Derive HD Path Private Seed (Solana/Biffco standard path)
      const path = "m/44'/501'/0'/0'"
      const derivedSeed = edKeyModule.derivePath(path, seed.toString('hex')).key
      
      // 4. Get Ed25519 Keypair via libsodium
      const keypair = sodium.crypto_sign_seed_keypair(derivedSeed)
      const pubKeyHex = sodium.to_hex(keypair.publicKey)
      const privKeyHex = sodium.to_hex(keypair.privateKey)
      
      if (mounted) {
        setMnemonic(words)
        setKeys({ publicKey: pubKeyHex, privateKey: privKeyHex })
        setIsGenerating(false)
      }
    }
    
    initCrypto()
    return () => { mounted = false }
  }, []) // eslint-disable-line

  const copyToClipboard = () => {
    if (!mnemonic) return
    navigator.clipboard.writeText(mnemonic)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadTxtFile = () => {
    if (!mnemonic) return
    const element = document.createElement("a");
    const file = new Blob([`BIFFCO - Recovery Phrase\n\nKEEP THIS FILE SECURE. DO NOT SHARE IT.\n\n${mnemonic}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "biffco-recovery-phrase.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const onNext = () => {
    if (!keys || !hasBackedUp) return
    // Persistimos public keys al global state
    useSignupStore.setState({ publicKey: keys.publicKey })
    store.nextStep()
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-20 animate-in fade-in duration-300">
        <IconLoader2 size={40} className="animate-spin text-primary mb-4" />
        <h3 className="text-xl font-bold text-navy">Generating Zero-Knowledge Architecture...</h3>
        <p className="text-sm text-text-secondary mt-2">Deriving Ed25519 keys locally on your device.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-navy mb-2">
          Recovery Phrase
        </h2>
        <p className="text-text-secondary text-base">
          BIFFCO does not store your Private Key. These 12 words are your only way to sign transactions and recover your digital identity.
        </p>
      </div>

      <div className="flex-1 flex flex-col pt-2 mb-2 pr-2">
        <div className="bg-error-subtle border border-error/20 rounded-md p-4 mb-6 flex items-start gap-4 shadow-sm">
          <div className="shrink-0 p-2 bg-error text-white rounded-md mt-0.5">
            <IconShieldLock size={20} stroke={1.5} />
          </div>
          <div>
            <h4 className="text-error font-bold text-sm mb-1 leading-tight">Do not share this phrase with anyone</h4>
            <p className="text-error/90 text-[13px] leading-relaxed">
              Anyone with these words will have full control over your Digital Identity and will be able to sign on your behalf. Store them in a secure (preferably offline) location.
            </p>
          </div>
        </div>

        <div className="bg-surface-raised border border-border rounded-lg p-5 relative group">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
            {mnemonic.split(' ').map((word, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[15px]">
                <span className="text-text-muted text-xs font-mono w-4 shrink-0 text-right select-none">{idx + 1}.</span>
                <span className="font-semibold text-navy tracking-wide select-all">{word}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 flex flex-row items-center gap-3">
          <button 
            type="button"
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface text-text-primary border border-border hover:bg-surface-raised rounded-md text-sm font-semibold transition-colors"
          >
            {copied ? <IconCheck size={18} className="text-success" /> : <IconCopy size={18} />} Copy to Clipboard
          </button>
          
          <button 
            type="button"
            onClick={downloadTxtFile}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface text-text-primary border border-border hover:bg-surface-raised rounded-md text-sm font-semibold transition-colors"
          >
            <IconDownload size={18} /> Download .TXT
          </button>
        </div>
        
        <div className="mt-8 bg-surface border border-border rounded-lg p-4 cursor-pointer hover:bg-surface-raised transition-colors group" onClick={() => setHasBackedUp(!hasBackedUp)}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex justify-center items-center shrink-0 transition-colors ${hasBackedUp ? 'bg-primary border-primary text-white' : 'border-border text-transparent group-hover:border-primary/50'}`}>
              <IconCheck size={14} stroke={3} />
            </div>
            <p className="text-sm font-medium text-text-primary select-none">
              I confirm that I have backed up my 12-word recovery phrase, and I understand that if I lose it, I lose my identity forever.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-6 border-t border-border">
        <button 
          onClick={store.prevStep}
          className="flex items-center justify-center gap-2 w-32 h-11 bg-surface text-text-primary border border-border hover:bg-surface-raised active:scale-95 rounded-full font-bold transition-all duration-200"
        >
          <IconArrowLeft size={18} stroke={2} /> Back
        </button>

        <button 
          onClick={onNext}
          disabled={!hasBackedUp}
          className="flex items-center justify-center gap-2 w-48 h-11 bg-primary text-white hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-full font-bold transition-all duration-200"
        >
          Continue <IconArrowRight size={18} stroke={2.5}/>
        </button>
      </div>
    </div>
  )
}
