'use client';

import React, { useState } from 'react';
import CreatePrimaryBook from '@/components/createPrimaryBook/createPrimaryBook';
import PrimaryknowledgeBook from '@/components/createPrimaryBook/primary-knowledge-id';

export default function PrimaryBookPage() {
    const [updateState, setUpdateState]=useState(0)
    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Primary Book</h1>
                    <p className="text-sm text-gray-500">Create and manage primary books.</p>
                </div>
                <CreatePrimaryBook setUpdateState={setUpdateState}/>
            </div>
            <PrimaryknowledgeBook updateState={updateState}/>
        </div>
    );
}
