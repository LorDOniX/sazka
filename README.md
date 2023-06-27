# muster

- dangerouslySetInnerHTML={{ __html: item.value }}

### Rozchozeni

- nainstalovaný nodejs 14+

```sh
git clone AAA
npm install
npm start
```

- webovka pak běží na http://localhost:4444/

### Apache
.htaccess
sudo a2enmod rewrite
sudo vim /etc/apache2/apache2.conf
<Directory /home/roman/www/>
	Options Indexes FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>
AllowOverride None -> AllowOverride All

## Vytvoření produkční verze

V root složce zavoláme:

```sh
npm run build-prod
```

V podadresáři `dist` je k nalezení sbírka assetů a index.html soubor, který je připravený na templatování při nasazování do provozu.

## Release postup

Obsah localhost/ jako statických souborů poslat ven



<?php
    // const a = async(password) => { const req = await fetch("http://localhost/index.php", { method: "POST", body: JSON.stringify({ password })}); const json = await req.json(); console.log(json); }
    $origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Origin: ".$origin);
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Content-Type: application/json; charset=utf-8");

    $method = $_SERVER["REQUEST_METHOD"];
    $output = array("error" => "", "data" => null);
    $JSONData = file_get_contents("php://input");
    $input = json_decode($JSONData);

    if ($method == "POST" && $input->password == "mart0880") {
        $json_data = file_get_contents('./data.json');
        $output["data"] = json_decode($json_data, true);
        http_response_code(200);
    } else {
        $output["error"] = "Špatné heslo!";
        http_response_code(404);
    }

	echo json_encode($output);
?>
