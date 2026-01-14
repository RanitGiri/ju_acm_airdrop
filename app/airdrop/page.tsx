'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { Wallet, CheckCircle2, AlertCircle, Loader2, Send, Mail, Phone, Image as ImageIcon, KeyRound, ArrowRight, Unplug, Users, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 'WALLET' | 'FORM' | 'OTP' | 'SUCCESS' | 'REJECTED'

export default function AirdropPage() {
    const [mounted, setMounted] = useState(false)
    const { address, isConnected, isConnecting } = useAccount()
    const { connect, status: connectStatus, error: connectError, connectors } = useConnect()
    const { disconnect } = useDisconnect()

    // Sync connectError with local error state
    useEffect(() => {
        if (connectError) {
            setError(connectError.message)
        }
    }, [connectError])

    const [step, setStep] = useState<Step>('WALLET')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        teamName: '',
        favoriteImageName: ''
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [otp, setOtp] = useState('')
    const [regHash, setRegHash] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        // Only move to FORM if we are in the initial WALLET step
        if (isConnected && step === 'WALLET') {
            setStep('FORM')
        }
        // If disconnected at any point, reset to WALLET unless success/rejected
        if (!isConnected && step !== 'SUCCESS' && step !== 'REJECTED' && step !== 'WALLET') {
            setStep('WALLET')
        }
    }, [isConnected, step, mounted])

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!imagePreview) {
            setError('PROTOCOL_ERROR: Identity_Artifact (Logo) is required for synchronization.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            console.log('Submitting form:', { ...formData, address })
            await new Promise(resolve => setTimeout(resolve, 1500))
            setStep('OTP')
        } catch (err: any) {
            setError(err.message || 'Verification failed. Please check your data.')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            const hash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
            setRegHash(hash)
            setStep('SUCCESS')
        } catch (err: any) {
            setError('Invalid OTP code. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    )

    return (
        <div className="min-h-screen text-white selection:bg-primary/30 pt-16 pb-12 px-4 relative overflow-hidden font-sans">
            {/* Content Container */}

            <div className="max-w-xl mx-auto relative z-10 space-y-8">
                {/* Header with Navigation Back */}
                <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-white text-black flex items-center justify-center rounded-xl font-black text-sm group-hover:rotate-12 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            JU
                        </div>
                        <span className="text-xs font-bold tracking-tight uppercase text-neutral-300 group-hover:text-white transition-colors">Return Home</span>
                    </Link>
                    {isConnected && (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Authenticated</span>
                                <span className="text-[10px] font-mono text-neutral-400">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-500/10 hover:text-red-500 group transition-all" onClick={() => disconnect()}>
                                <Unplug className="w-4 h-4 text-neutral-400 group-hover:text-red-500" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-5 py-2 border-primary/30 bg-primary/10 text-white transition-all backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                        JU ACM // SYNCHRONICITY 2026
                    </Badge>
                    <h1 className="text-6xl font-black tracking-tighter bg-linear-to-b from-white via-white to-neutral-500 bg-clip-text text-transparent italic leading-[0.9]">
                        INITIALIZE <br /> YOUR <br /> IDENTITY
                    </h1>
                </div>

                {/* Step Indicator */}
                <div className="grid grid-cols-4 gap-3 px-2">
                    {['Connect', 'Register', 'Authorize', 'Secure'].map((label, i) => {
                        const steps: Step[] = ['WALLET', 'FORM', 'OTP', 'SUCCESS']
                        const isActive = steps.indexOf(step) >= i
                        return (
                            <div key={label} className="flex flex-col gap-2.5">
                                <div className={cn(
                                    "h-1.5 rounded-full transition-all duration-700",
                                    isActive ? "bg-white" : "bg-neutral-800"
                                )} />
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest text-center transition-colors",
                                    isActive ? "text-white" : "text-neutral-600"
                                )}>
                                    {label}
                                </span>
                            </div>
                        )
                    })}
                </div>

                <Card className="border-white/10 bg-neutral-900/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group rounded-[2.5rem]">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-transparent via-primary/40 to-transparent" />

                    <CardHeader className="pt-10 px-8 text-center sm:text-left">
                        <CardTitle className="flex items-center gap-4 text-3xl font-black italic tracking-tight bg-linear-to-b from-white via-white to-neutral-500 bg-clip-text text-transparent">
                            {step === 'WALLET' && <><Wallet className="w-7 h-7 text-white" /> INITIALIZE WALLET</>}
                            {step === 'FORM' && <><ImageIcon className="w-7 h-7 text-white" /> TEAM REGISTRATION</>}
                            {step === 'OTP' && <><KeyRound className="w-7 h-7 text-white" /> SECURITY PASS</>}
                            {step === 'SUCCESS' && <><CheckCircle2 className="w-7 h-7 text-emerald-400" /> IDENTITY SECURED</>}
                            {step === 'REJECTED' && <><AlertCircle className="w-7 h-7 text-red-500" /> ACCESS DENIED</>}
                        </CardTitle>
                        <CardDescription className="text-neutral-400 font-bold italic text-sm mt-1">
                            {step === 'WALLET' && "Uplink to the Synchronicity network node via secure wallet."}
                            {step === 'FORM' && "Synchronizing parameters with JU-ACM's encrypted registry."}
                            {step === 'OTP' && "Validating authentication frequency for identity minting."}
                            {step === 'SUCCESS' && "Legacy hash finalized. Your digital pass is now broadcasted."}
                            {step === 'REJECTED' && "Protocol mismatch. No synchronized record found in this node."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-10 px-8">
                        {error && (
                            <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
                                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-500 rounded-2xl p-4">
                                    <AlertCircle className="h-5 w-5" />
                                    <div className="ml-2">
                                        <AlertTitle className="text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Error_Log: Protocol_Violation</AlertTitle>
                                        <AlertDescription className="text-[11px] font-bold opacity-90 mt-1">{error}</AlertDescription>
                                    </div>
                                </Alert>
                            </div>
                        )}

                        {step === 'WALLET' && (
                            <div className="space-y-4">
                                <Button
                                    onClick={() => {
                                        const connector = connectors[0];
                                        if (connector) connect({ connector });
                                        else alert("No wallet found. Please install MetaMask!");
                                    }}
                                    disabled={isConnecting}
                                    variant="premium"
                                    size="lg"
                                    className="w-full h-20 text-xl tracking-[0.2em] flex items-center justify-center gap-4 group rounded-3xl"
                                >
                                    {isConnecting ? (
                                        <Loader2 className="h-7 w-7 animate-spin text-black" />
                                    ) : (
                                        <>
                                            ESTABLISH CONNECTION
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </Button>
                                {connectError && (
                                    <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-center shadow-lg">
                                        <p className="text-[11px] text-red-400 font-bold uppercase tracking-widest italic">
                                            {connectError.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 'FORM' && (
                            <form onSubmit={handleFormSubmit} className="space-y-8">
                                <div className="space-y-5">
                                    <div className="group space-y-2.5">
                                        <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-focus-within:text-neutral-300 transition-colors flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5" /> Team Name
                                        </Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter your team name"
                                            required
                                            className="h-16 text-lg bg-neutral-950/80 border-white/10 focus-visible:ring-primary/40 focus-visible:border-primary/50 text-white rounded-2xl shadow-inner transition-all hover:bg-neutral-900"
                                            value={formData.teamName}
                                            onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="group space-y-2.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-focus-within:text-neutral-300 transition-colors flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" /> Registered Email
                                            </Label>
                                            <Input
                                                type="email"
                                                placeholder="synchronicity@ju.acm"
                                                required
                                                className="h-16 text-lg bg-neutral-950/80 border-white/10 focus-visible:ring-primary/40 focus-visible:border-primary/50 text-white rounded-2xl shadow-inner transition-all hover:bg-neutral-900"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="group space-y-2.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-focus-within:text-neutral-300 transition-colors flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" /> Verification Phone
                                            </Label>
                                            <Input
                                                type="tel"
                                                placeholder="+91 00000 00000"
                                                required
                                                className="h-16 text-lg bg-neutral-950/80 border-white/10 focus-visible:ring-primary/40 focus-visible:border-primary/50 text-white rounded-2xl shadow-inner transition-all hover:bg-neutral-900"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                            />
                                        </div>
                                    </div>

                                    <div className="group space-y-2.5">
                                        <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-focus-within:text-neutral-300 transition-colors flex items-center justify-between">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon className="w-3.5 h-3.5" /> Team Logo Artifact
                                                </div>
                                                <span className="text-[8px] text-neutral-600 font-bold tracking-tight">MAX 5MB | PNG / JPG / SVG</span>
                                            </div>
                                            <span className="text-primary text-[8px]">REQUIRED</span>
                                        </Label>
                                        <div className="relative group/upload">
                                            <input
                                                type="file"
                                                id="image-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        setFormData({ ...formData, favoriteImageName: file.name })
                                                        const reader = new FileReader()
                                                        reader.onloadend = () => {
                                                            setImagePreview(reader.result as string)
                                                        }
                                                        reader.readAsDataURL(file)
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl bg-neutral-950/50 hover:bg-neutral-900/50 hover:border-primary/50 cursor-pointer transition-all group-hover:shadow-[0_0_30px_rgba(var(--primary),0.05)]"
                                            >
                                                {imagePreview ? (
                                                    <div className="relative w-full h-full p-2">
                                                        <img src={imagePreview} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity rounded-xl">
                                                            <Upload className="w-6 h-6 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-center px-4">
                                                        <Upload className="w-6 h-6 text-neutral-600 group-hover:text-primary transition-colors" />
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest leading-none">Select Image Asset</p>
                                                            <p className="text-[8px] font-bold text-neutral-700 uppercase tracking-tighter">Recommended: 512x512 (Square Aspect)</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading} className='w-full h-18 rounded-2xl font-black bg-white text-black hover:bg-neutral-200 hover:text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] text-base tracking-widest' size="lg"  >
                                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "SEND SECURITY CODE"}
                                </Button>
                            </form>
                        )}

                        {step === 'OTP' && (
                            <form onSubmit={handleOtpSubmit} className="space-y-10 text-center">
                                <div className="space-y-5">
                                    <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Authenticating: {formData.email} ...</p>
                                    </div>
                                    <Input
                                        placeholder="000 000"
                                        maxLength={6}
                                        required
                                        className="text-center text-5xl h-24 tracking-[0.4em] font-black bg-neutral-950/90 border-white/10 focus:border-primary/50 rounded-3xl shadow-2xl transition-all"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                                <div className="flex flex-col gap-5">
                                    <Button type="submit" disabled={loading} size="lg" className="w-full h-18 rounded-2xl font-black bg-white text-black hover:bg-neutral-200 hover:text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] text-base tracking-widest">
                                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "CONFIRM VERIFICATION"}
                                    </Button>
                                    <button type="button" className="text-[11px] font-black text-neutral-500 hover:text-white tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 mx-auto">
                                        Resend Auth Code
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="text-center space-y-8 py-4">
                                {/* Digital Participant Pass */}
                                <div className="relative mx-auto w-full max-w-[340px] aspect-[3/4] bg-neutral-950 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl group/pass animate-in fade-in zoom-in duration-700">
                                    {/* Pass Background & Accents */}
                                    <div className="absolute top-0 left-0 w-full h-full">
                                        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-white/5 to-transparent" />
                                        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[80px]" />
                                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[60px]" />
                                    </div>

                                    <div className="relative h-full flex flex-col p-8 z-10">
                                        {/* Pass Header */}
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-tight">Official</p>
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">Digital Pass</p>
                                            </div>
                                            <div className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-lg font-black text-xs">JU</div>
                                        </div>

                                        {/* Team Logo Container */}
                                        <div className="flex-1 flex flex-col items-center justify-center gap-6">
                                            <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative group-hover/pass:scale-110 transition-transform duration-500 bg-neutral-900">
                                                {imagePreview ? (
                                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Team Logo" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="w-10 h-10 text-neutral-800" />
                                                    </div>
                                                )}
                                                {/* Technical Scanline Overlay */}
                                                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cline x1=%220%22 y1=%220%22 x2=%22100%22 y2=%220%22 stroke=%22white%22 stroke-opacity=%220.05%22 stroke-width=%220.5%22/%3E%3C/svg%3E')] bg-[size:100%_4px] pointer-events-none" />
                                                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-primary/20 via-transparent to-primary/20 opacity-0 group-hover/pass:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/50 shadow-[0_0_15px_#fff] animate-[scan_3s_linear_infinite] pointer-events-none" />
                                            </div>

                                            <div className="text-center space-y-1">
                                                <p className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.3em]">HACKATHON TEAM</p>
                                                <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">{formData.teamName || "ELITE SQUAD"}</h3>
                                            </div>
                                        </div>

                                        {/* Pass Footer */}
                                        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                                            <div className="flex justify-between items-center text-[9px] font-bold text-neutral-600 uppercase tracking-widest italic">
                                                <span>{address?.slice(0, 8)}...</span>
                                                <span className="text-emerald-400 font-black">CERTIFIED ✓</span>
                                            </div>
                                            {/* Technical Signature Barcode */}
                                            <div className="space-y-2">
                                                {/*<div className="h-8 w-full bg-neutral-950/50 border border-white/5 rounded-lg flex items-end justify-between px-2 pb-1 gap-[1px] overflow-hidden group-hover/pass:border-primary/20 transition-colors">
                                                    {Array.from({ length: 48 }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-[2px] bg-neutral-600 rounded-full"
                                                            style={{
                                                                height: `${20 + Math.random() * 60}%`,
                                                                opacity: 0.2 + Math.random() * 0.5
                                                            }}
                                                        />
                                                    ))}
                                                </div>*/}
                                                <div className="flex flex-col gap-0.5 opacity-40 group-hover/pass:opacity-100 transition-opacity">
                                                    <p className="text-[6px] font-mono text-neutral-400 text-left leading-none">REG_ID_HASH_X86_64</p>
                                                    <p className="text-[8px] font-mono text-white text-left break-all leading-tight tracking-tighter">
                                                        {regHash || "0x0000000000000000000000000000000000000000"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 px-4">
                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase text-emerald-400 leading-tight">IDENTITY MATERIALIZED</h3>
                                    <p className="text-neutral-400 text-xs font-bold leading-relaxed italic max-w-xs mx-auto">
                                        Logo minted successfully. Your digital identity is synchronized for Synchronicity 2026!
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 px-4">
                                    <Link href="/" className="w-full">
                                        <Button className='w-full h-16 rounded-2xl font-black bg-white text-black hover:bg-neutral-200 shadow-xl text-sm tracking-widest uppercase transition-all group' size="lg">
                                            RETURN TO HOME
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="ghost" className="h-12 text-[9px] font-black text-neutral-200 uppercase tracking-widest border border-white/5 hover:border-white/10 rounded-xl" onClick={() => window.location.reload()}>
                                            RESET_IDENTITY
                                        </Button>
                                        <Button variant="ghost" className="h-12 text-[9px] font-black text-neutral-200 uppercase tracking-widest border border-white/5 hover:border-white/10 rounded-xl" onClick={() => alert("Artifact Downloaded: identity_pass.png")}>
                                            SAVE_ARTIFACT
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'REJECTED' && (
                            <div className="text-center space-y-10 py-8">
                                <div className="w-28 h-28 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-red-500/30 shadow-[0_0_60px_rgba(239,68,68,0.2)] animate-in zoom-in duration-500">
                                    <AlertCircle className="w-14 h-14 text-red-500" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black italic tracking-tighter uppercase text-red-500 leading-[0.85]">ACCESS <br /> DENIED</h3>
                                    <div className="space-y-2">
                                        <p className="text-neutral-400 text-sm font-bold leading-relaxed max-w-xs mx-auto italic">
                                            Identity mismatch detected. No verified registration found in the secure batch.
                                        </p>
                                        <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                                            Trace_ID: {Math.random().toString(36).substring(7).toUpperCase()} // Code: 403_UNAUTHORIZED
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button className="w-full h-16 rounded-2xl bg-white text-black hover:bg-neutral-200 hover:text-black font-black uppercase tracking-widest text-sm transition-all" onClick={() => setStep('FORM')}>
                                        RE-TRY REGISTRATION
                                    </Button>
                                    <Link href="/" className="w-full">
                                        <Button variant="outline" className="w-full h-16 rounded-2xl border-white/10 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-sm transition-all">
                                            BACK TO HOME
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <style jsx global>{`
                    @keyframes scan {
                        0% { transform: translateY(-32px); }
                        100% { transform: translateY(128px); }
                    }
                    @keyframes gradient {
                        0% { background-position: 0% center; }
                        100% { background-position: 200% center; }
                    }
                    .animate-gradient {
                        animation: gradient 4s linear infinite;
                    }
                `}</style>
            </div>
        </div>
    )
}
