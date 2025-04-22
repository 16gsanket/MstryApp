'use client'
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-separator';
import axios, { AxiosError } from 'axios';
import { Loader, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';


/*Topics to cover in this module is

   *** IMP :- if you are using the react-hook-from  nin one of the file you need to stick to it to handle any further forms even if the fields are just 1 in number
    1) to learn the 'watch' event in the react-hook-from
    1) to learn the 'setValue' event in the react-hook-from
    2)Optimistic UI


*/

function DashBoard() {

    const[message , setMessage] = useState<Message[]>([]);
    const[isLoading , setIsLoading] = useState<boolean>();
    const[isSwitching , setIsSwitching] = useState<boolean>(false);

    const form = useForm({
        resolver : zodResolver(acceptMessageSchema)
    })

    const {watch , setValue , register} = form;

    const acceptMessage = watch('acceptMessage');
    const{data:session} = useSession()


    const handleDeleteMessage = (messageId: string) => {
        setMessage(message.filter((message) => message._id !== messageId));
      };

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitching(true)

        try {
            const response =  await axios.get(`/api/accept-messages`)
            setValue('acceptMessage' , response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            console.log("error in accepting message", axiosError.response?.data.message);
            toast('Cannnot Delete the message')
        }finally{
            setIsSwitching(false)
        }
    },[setValue])

    const fetchMessages = useCallback(async (refresh : boolean = false) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/get-messages`)
            setMessage(response.data.messages)
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            console.log("error in accepting message", axiosError.response?.data.message);
            toast('Cannnot Delete the message')
        }finally{
            setIsLoading(false)
        }
    },[])

    useEffect(()=>{
        fetchMessages()
        fetchAcceptMessage()
        if(!session || !session.user) return
    },[session , setMessage , fetchMessages , fetchAcceptMessage])

    const handleSwitchChange = async() =>{
        setIsSwitching(true)
        try {
            const repsonse = await axios.post('/api/accept-messages' , {AcceptingMessages : !acceptMessage})
            setValue('acceptMessage' , !acceptMessage)
            toast('Successfully Updated')
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            console.log("error in accepting message", axiosError.response?.data.message);
            toast('Cannnot Delete the message')
        }finally{
            setIsSwitching(false)
        }
    }

    const {username} = session?.user as User

    // know to get the base URL 
    const baseURL = `${window.location.protocol}//${window.location.host}`
    let profileUrl = `${baseURL}/profile/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast('Copied to clipboard');
      };

    if(!session || !session.user) return <div>Please Login</div>

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
    
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
            <div className="flex items-center">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>
    
          <div className="mb-4">
            <Switch
              {...register('acceptMessage')}
              checked={acceptMessage}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitching}
            />
            <span className="ml-2">
              Accept Messages: {acceptMessage ? 'On' : 'Off'}
            </span>
          </div>
          <Separator />
    
          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {message.length > 0 ? (
              message.map((message : Message, index) => (
                <MessageCard
                  key = {(message._id as string)}
                  message={message}
                  onMessageDelete= {handleDeleteMessage as ()=>void}
                />
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
        </div>
      );
}

export default DashBoard