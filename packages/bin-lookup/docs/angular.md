# Angular

Call `lookup()` directly from a component; there is no service or module to
register since the function has no state and no dependencies.

```ts
import { Component } from "@angular/core";
import { lookup, type LookupResult } from "bin-lookup";

@Component({
  selector: "app-card-lookup",
  standalone: true,
  template: `
    <input [(ngModel)]="value" (ngModelChange)="onChange($event)" />
    <p *ngIf="result">
      {{ result.scheme ?? "unknown" }} · {{ result.bank ?? "unknown bank" }}
    </p>
  `,
})
export class CardLookupComponent {
  value = "";
  result: LookupResult | null = null;

  onChange(value: string) {
    const digits = value.replace(/\D/g, "");
    this.result = digits.length >= 6 ? lookup(value) : null;
  }
}
```

(Needs `FormsModule` imported for `ngModel`, as in any Angular form.)

## If you prefer a service wrapper

Not required, but if your team's style guide wants all external calls behind
an injectable service:

```ts
import { Injectable } from "@angular/core";
import { lookup, type LookupResult } from "bin-lookup";

@Injectable({ providedIn: "root" })
export class BinLookupService {
  lookup(input: string): LookupResult {
    return lookup(input);
  }
}
```
