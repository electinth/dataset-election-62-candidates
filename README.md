# Election 2562 Candidates

This dataset contains a list of candidates for Thailand's Election 2562, which will be held on March 24, 2562. 

The original data is [PDFs](https://www.ect.go.th/ect_th/news_all.php?cid=165) from The Election Commission of Thailand (ECT).

If you spot mistakes, please do report them [here](https://docs.google.com/spreadsheets/d/1T0-iBdBVl69q5N7Tz0fO70OtGdg70Fv0x5WiLTKOcGc/edit?usp=sharing).


## Zone & Candidate Browsering Web
This website has two components, first page and zone pages. The first page has a form entering a postcode. We use React for HTML DOM manipulation. On the other hand, zone pages are just static files that are generated accordingly. Please see `generate-site.py` for more details.

### Development
Every change made to those pagaes, located in `election62`, requires a regeneration. One can use the following command to automatically update the site:
```
watch -n 10 'python generate-site.py --env dev'
```

Because the final web will be generated to `./dist`,  you can run a static web server from the root directory and access it via `http://<HOSTNAME>:<POST>/dist`. You might encouter cross-origin issues. If that the case, please check `deploy_path` in `generate-site.py`.

```
python -m SimpleHTTPServer
```

## Changelog
- next
```
- รหัสที่มีปัญหา 33150, 41000,
- https://www.facebook.com/electinth/posts/371876360297770?comment_id=372263686925704&comment_tracking=%7B%22tn%22%3A%22R9%22%7D
```
- 17/02/19
```
# v0.2.1
- search popup
- correct อนาคตใหม่ ดาต้า (กทม.​ 12, 30)
- update หมายเหตุ

# v0.2
- Attach index url to the ELECT logo (Issue#1)
- Use React Prod files (PR#2)
- Track candidate search to Google Analytics.
- Correct อนาคตไทย candidates, not อนาคตใหม่
- logo พรรคกลาง
```