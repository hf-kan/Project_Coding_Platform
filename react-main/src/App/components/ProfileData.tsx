import React from 'react';

/**
 * Renders information about the user obtained from Microsoft Graph
 */

function ProfileData(props:any) {
  const { graphData } = props;
  const {
    givenName,
    surname,
    userPrincipalName,
    id,
  } = graphData;
  return (
    <div id="profile-div">
      <p>
        <strong>First Name: </strong>
        {givenName}
      </p>
      <p>
        <strong>Last Name: </strong>
        {surname}
      </p>
      <p>
        <strong>Email: </strong>
        {userPrincipalName}
      </p>
      <p>
        <strong>Id: </strong>
        {id}
      </p>
    </div>
  );
}

export default ProfileData;
