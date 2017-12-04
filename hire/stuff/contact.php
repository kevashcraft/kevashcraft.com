<?php

$params = ['name' => 'N/A', 'email' => 'N/A', 'message' => 'N/A'];
foreach ($params as $param => $value) {
  if (isset($_POST[$param]) && !empty($_POST[$param])) {
    $params[$param] = $_POST[$param];
  }
}

$to = 'Hire Kevin <hire@kevashcraft.com>'; // note the comma

$date = date('Y-m-d H:i');
$subject = "HIRE CONTACT - {$params['name']} - {$params['email']} - {$date}";


// Message
$message = "
<html>
<head>
  <title>Hire Kevin!</title>
</head>
<body>
  <p>Received a hire contact!</p>
  <p>Date: {$date}</p>
  <p>Name: {$params['name']}</p>
  <p>Email: {$params['email']}</p>
  <p>Message: {$params['message']}</p>
  <p>Have a cool day!</p>
  <p>--Kevin Auto</p>
</body>
</html>
";

// To send HTML mail, the Content-type header must be set
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=iso-8859-1';

// Additional headers
$headers[] = 'From: Hire Kevin Site <hiresite@kevashcraft.com>';

// Mail it
mail($to, $subject, $message, implode("\r\n", $headers));
