'use client';

import { UploadDropzone } from '@uploadthing/react';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';


const FileUpload = ({
    onChange,
    onRemove,
    value
}) => {
    const { toast } = useToast();

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value && (
                    <div className='relative h-[200px] w-[200px] overflow-hidden rounded-sm'>
                        <div className="absolute right-2 top-2 z-10">
                            <Button
                                type="button"
                                onClick={() => onRemove('')}
                                variant="destructive"
                                size="sm"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <Image
                                fill
                                className="object-contain"
                                alt="Image"
                                src={value || ''}
                            />
                        </div>
                    </div>
                )}
            </div>
            {!value && <div>

                <UploadDropzone
                    className="ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300 py-2 dark:bg-zinc-800"
                    endpoint="imageUploader"
                    config={{ mode: 'auto' }}
                    content={{
                        allowedContent({ isUploading }) {
                            if (isUploading)
                                return (
                                    <>
                                        <p className="mt-2 animate-pulse text-sm text-slate-400">
                                            Img Uploading...
                                        </p>
                                    </>
                                );
                        }
                    }}
                    onClientUploadComplete={(res) => {
                        // Do something with the response
                        const data = res;
                        if (data) {
                            console.log(data)
                            onChange(`https://utfs.io/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/${data[0].key}`);
                        }
                    }}
                    onUploadError={(error) => {
                        toast({
                            title: 'Error',
                            variant: 'destructive',
                            description: error.message
                        });
                    }}
                    onUploadBegin={() => {
                        // Do something once upload begins
                    }}
                />

            </div>}
        </div>
    )

}

export default FileUpload