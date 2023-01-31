import React from 'react';
import { Button } from '@jd/jmtd';
import '@jd/jmtd/dist/themes/default.css';
import './styles.css';

export default function Demo({ large, title }) {
    return (
        <div className='jmtd-button-demo'>
            <h1>{title}=</h1>
            <Button semantic='primary' size='large'>
                large
            </Button>
        </div>
    );
}

Demo.defaultProps = {
    size: 'large',
    title: 'meinuo test',
};
