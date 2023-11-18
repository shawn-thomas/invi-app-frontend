import React from 'react';
import './Alert.css';

/** Error component.
 *
 * Presentational component for displaying error messages.
 *
 * Usage:
 * <Error messages={['Error message 1', 'Error message 2']} />
 */

function Alert({ messages }) {
  return (
    <div className="alert" role="alert">
        {messages.map((message) => (
          <p>{message}</p>
        ))}
    </div>
  );
}

export default Alert;
