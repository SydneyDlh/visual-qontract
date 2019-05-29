import React from 'react';
import { ClipboardCopy, ClipboardCopyVariant } from '@patternfly/react-core';
import { Col } from 'patternfly-react';
import Definition from '../../components/Definition';
import Roles from './Roles';

function User({ user }) {
  let downloadKeyButton;
  let gpg;
  if (user.public_gpg_key == null) {
    downloadKeyButton = '';
    gpg = <div> - </div>;
  } else {
    downloadKeyButton = (
      <button type="button" onClick={downloadKey}>
        Download Key
      </button>
    );
    gpg = (
      <div>
        <Col style={{ width: 500 }}>
          <ClipboardCopy isReadOnly variant={ClipboardCopyVariant.expansion}>
            {user.public_gpg_key}
          </ClipboardCopy>
          {downloadKeyButton}
        </Col>
      </div>
    );
  }

  // taken from: https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
  // there probably is a better way in react to do this
  function downloadKey(e) {
    if (user.public_gpg_key != null) {
      e.preventDefault();
      const element = document.createElement('a');
      const file = new Blob([user.public_gpg_key], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${user.redhat_username}_public_gpg_key.gpg`;
      document.body.appendChild(element);
      element.click();
    }
  }

  return (
    <React.Fragment>
      <h4>Info</h4>
      <Definition
        items={[
          ['Name', user.name],
          ['Path', <a href={`${window.DATA_DIR_URL}${user.path}`}>{user.path}</a>],
          [
            'Red Hat Username',
            <a href={`https://mojo.redhat.com/people/${user.redhat_username}`}>{user.redhat_username}</a>
          ],
          ['GitHub Username', <a href={`https://github.com/${user.github_username}`}>{user.github_username}</a>],
          [
            'Quay Username',
            (user.quay_username && <a href={`https://quay.io/user/${user.quay_username}`}>{user.quay_username}</a>) ||
              '-'
          ]
        ]}
      />
      <h5> Public GPG Key </h5>
      {gpg}
      <h4>Roles</h4>
      <Roles roles={user.roles} />
    </React.Fragment>
  );
}

export default User;
