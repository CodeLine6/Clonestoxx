"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'
import { emailValidation } from '@/schemas/userSchema'
import { Button } from './ui/button'
import { useFormContext } from 'react-hook-form'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'

function ProfileEmailInput({ username, ...field }) {
    const verifiedEmail = useRef([field.value])
    const [currValue, setCurrentValue] = useState(field.value)
    const [otp, setOtp] = useState(null)
    const [userInput, setUserInput] = useState(0)
    const [sendingCode, setSendingCode] = useState(false)
    const { toast } = useToast()
    const { setError, clearErrors, setValue } = useFormContext()


    const onChange = (e) => {
        const newValue = e.target.value
        setCurrentValue(newValue)
        setValue('email', newValue) // Update the form value
    }

    const isValid = emailValidation.safeParse(currValue).success
    useEffect(() => {
        if (!isValid) {
            setError("email", { type: "custom", message: "Email is not valid" })
            return
        }
        if (!verifiedEmail.current.includes(currValue)) {
            setError("email", { type: "custom", message: "Email is not verified" })
        }
        else {
            clearErrors("email")
        }
    }, [currValue])

    const handleUserInput = (value) => {
        setUserInput(value)
    }

    const verifyEmail = (e) => {
        e.preventDefault()
        if (Number(userInput) === otp) {
            clearErrors("email")
            setOtp(null)
            verifiedEmail.current.push(currValue)
        }
        else setError("email", { type: "custom", message: "Invalid OTP" })
    }

    const generateOtp = async () => {
        const verifyCode = Math.floor(100000 + Math.random() * 900000)
        setSendingCode(true)
        try {
            const emailResponse = await axios.post("/api/update-profile/verify-email", { username, email: currValue, verifyCode })

            if (!emailResponse.data.success) {
                toast({
                    title: "Error",
                    description: emailResponse.data.message,
                    variant: "destructive"
                })
                return
            }

            toast({
                title: "Verification Code Sent",
                description: "Please check your email for the verification code",
                variant: "success"
            })

            setOtp(verifyCode)
        }
        catch (err) {
            console.error("Error sending verification email", err)
            toast({
                title: "Error",
                description: "Error sending verification email",
                variant: "destructive"
            })
        } finally {
            setSendingCode(false)
        }
    }


    return (
        <div className='relative'>
            <Input
                type="email" placeholder="Email" disabled={otp || sendingCode} {...field} onChange={onChange} />
            {
                isValid && !verifiedEmail.current.includes(currValue) && !otp && (
                    <Button onClick={generateOtp} disabled={sendingCode} className='absolute right-1 top-1/2 -translate-y-1/2' variant="link" >{sendingCode ? <Loader2 className='animate-spin' /> : "GET OTP"}</Button>
                )
            }
            {
                otp && (<>
                    <p className='my-2 text-sm text-foreground'>Enter the verification code sent to email</p>
                    <div className='w-full grid grid-cols-[auto_1fr]'>
                        <InputOTP maxLength={6} onChange={handleUserInput} >
                            <InputOTPGroup>
                                <InputOTPSlot className="border-gray-400" index={0} />
                                <InputOTPSlot className="border-gray-400" index={1} />
                                <InputOTPSlot className="border-gray-400" index={2} />
                                <InputOTPSlot className="border-gray-400" index={3} />
                                <InputOTPSlot className="border-gray-400" index={4} />
                                <InputOTPSlot className="border-gray-400" index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <Button onClick={verifyEmail} disabled={userInput.length < 6} variant="link" >{sendingCode ? <Loader2 className='animate-spin' /> : "VERIFY"}</Button>
                    </div>
                </>
                )
            }
        </div>
    )
}

export default ProfileEmailInput