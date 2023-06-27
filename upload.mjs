import * as ftp from "basic-ftp"

async function ftpUpload(removeJsFiles) {
	const client = new ftp.Client();

	try {
		await client.access({
			host: "307882.w82.wedos.net",
			user: "w307882",
			password: "5v26p3Vm",
			secure: true,
		});

		await client.cd("/www/subdom/sazka/");

		if (removeJsFiles) {
			const list = await client.list(".");
			const filtered = list.map(item => item.name).filter(item => item.indexOf(".js") !== -1 || item.indexOf(".css") !== -1);

			for (let file of filtered) {
				console.log(`Remove file ${file}`);
				await client.remove(file);
			}
		}

		console.log(`Upload dist directory...`);
		client.trackProgress(info => {
			info.bytes !== 0 && console.log(`File upload ${info.name}...`);
		});

		await client.uploadFromDir("./dist");
	} catch(err) {
		console.log(err)
	}

	client.close();
}

function main() {
	const args = process.argv.slice(2);
	const removeJsFiles = args.length === 1 && args[0] === "remove-js-files";

	ftpUpload(removeJsFiles);
}

main();
