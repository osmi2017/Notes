import React from 'react';

export function InputField({ 
  label, 
  value, 
  placeholder, 
  type = "text", 
  forgotPassword, 
  onChange 
}) {
  return (
    <div className="flex flex-col w-full leading-none whitespace-nowrap text-slate-700">
      <div className="flex items-start w-full text-base leading-none capitalize">
        <div className="flex-1 shrink basis-0 text-slate-700">
          {label}
        </div>
        {forgotPassword && (
          <div className="text-right text-blue-600 cursor-pointer">
            Forgot?
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-3 w-full text-sm min-h-[48px]">
        <div className="flex flex-1 shrink gap-1.5 items-center px-4 py-3 rounded-lg border-blue-100 border-solid basis-0 border-[3px] min-w-[240px] size-full">
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none"
            aria-label={label}
          />
          {type === "password" && (
            <div className="flex gap-2 items-center self-stretch my-auto w-6">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4645b0ba159c25103a9e30993db2d723a6479d8603712d3d88f07c30f6a52f04?placeholderIfAbsent=true&apiKey=d42e8dbb76a742d4a7de8cc420a882ee"
                alt="Toggle visibility"
                className="object-contain self-stretch my-auto w-6 aspect-square cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
